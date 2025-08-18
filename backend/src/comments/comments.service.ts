import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Comment } from 'src/types/comment';

@Injectable()
export class CommentsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  // ✅ CREATE
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

    const newComment: Comment = {
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
      const docRef = db.collection('comments').doc();
      transaction.set(docRef, newComment);
      transaction.update(postRef, {
        commentsCount: admin.firestore.FieldValue.increment(1),
      });
    });

    return { ...newComment };
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

    await db.runTransaction(async (transaction) => {
      const replies = await db
        .collection('comments')
        .where('parentId', '==', commentId)
        .get();

      transaction.delete(commentRef);
      replies.forEach((reply) => transaction.delete(reply.ref));

      transaction.update(postRef, {
        commentsCount: admin.firestore.FieldValue.increment(
          -(1 + replies.size),
        ),
      });
    });

    return { message: 'Comment and replies deleted successfully' };
  }

  async getCommentsForPost(postId: string) {
    const db = this.firebaseService.getFirestore();

    const postDoc = await db.collection('posts').doc(postId).get();
    if (!postDoc.exists)
      throw new NotFoundException(`Post ${postId} not found`);

    const snapshot = await db
      .collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'asc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}
