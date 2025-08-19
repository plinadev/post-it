import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Comment } from 'src/types/comment';
import { FirebaseUser } from 'src/types/userdata';

@Injectable()
export class CommentsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createComment(
    userId: string,
    postId: string,
    content: string,
    parentId?: string | null,
  ) {
    const db = this.firebaseService.getFirestore();

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists)
      throw new NotFoundException(`User ${userId} not found`);

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();
    if (!postDoc.exists)
      throw new NotFoundException(`Post ${postId} not found`);

    if (parentId) {
      const parentDoc = await db.collection('comments').doc(parentId).get();
      if (!parentDoc.exists)
        throw new NotFoundException(`Parent comment ${parentId} not found`);

      const parent = parentDoc.data();
      if (parent?.postId !== postId) {
        throw new ForbiddenException(
          `Parent comment does not belong to this post`,
        );
      }
    }

    const docRef = db.collection('comments').doc();

    const newComment: Comment = {
      id: docRef.id, // include ID
      postId,
      userId,
      content,
      parentId: parentId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: null,
      edited: false,
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    await db.runTransaction(async (transaction) => {
      transaction.set(docRef, newComment);
      transaction.update(postRef, {
        commentsCount: admin.firestore.FieldValue.increment(1),
      });
    });

    return newComment;
  }

  async updateComment(userId: string, commentId: string, content: string) {
    const db = this.firebaseService.getFirestore();
    const commentRef = db.collection('comments').doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists)
      throw new NotFoundException(`Comment ${commentId} not found`);

    const comment = commentDoc.data();
    if (comment?.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    await commentRef.update({
      content,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      edited: true,
    });

    return {
      id: commentId,
      ...comment,
      content,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      edited: true,
    };
  }

  async deleteComment(userId: string, commentId: string) {
    const db = this.firebaseService.getFirestore();
    const commentRef = db.collection('comments').doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists)
      throw new NotFoundException(`Comment ${commentId} not found`);

    const comment = commentDoc.data();
    if (comment?.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const postRef = db.collection('posts').doc(comment.postId);

    // Collect all nested replies recursively
    async function getAllReplies(
      id: string,
    ): Promise<FirebaseFirestore.DocumentSnapshot[]> {
      const repliesSnap = await db
        .collection('comments')
        .where('parentId', '==', id)
        .get();
      const replies = repliesSnap.docs;
      const nested = await Promise.all(replies.map((r) => getAllReplies(r.id)));
      return [...replies, ...nested.flat()];
    }

    const allReplies = await getAllReplies(commentId);

    await db.runTransaction(async (transaction) => {
      transaction.delete(commentRef);
      allReplies.forEach((reply) => transaction.delete(reply.ref));

      transaction.update(postRef, {
        commentsCount: admin.firestore.FieldValue.increment(
          -(1 + allReplies.length),
        ),
      });
    });

    return { message: 'Comment and replies deleted successfully' };
  }

  async getCommentsForPost(postId: string) {
    const db = this.firebaseService.getFirestore();

    const postDoc = await db.collection('posts').doc(postId).get();
    if (!postDoc.exists) {
      throw new NotFoundException(`Post ${postId} not found`);
    }

    const snapshot = await db
      .collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) return [];

    const comments = snapshot.docs.map((doc) => {
      const data = doc.data() as Comment;
      return { id: doc.id, ...data };
    });

    const authorIds = Array.from(new Set(comments.map((c) => c.userId)));

    const userDocs = await db.getAll(
      ...authorIds.map((id) => db.collection('users').doc(id!)),
    );

    const usersMap: Record<string, FirebaseUser> = {};
    userDocs.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data() as FirebaseUser;
        usersMap[doc.id] = {
          username: data.username,
          avatarUrl: data.avatarUrl,
        };
      }
    });

    return comments.map((comment) => ({
      ...comment,
      author: usersMap[comment.userId!] ?? null,
    }));
  }
}
