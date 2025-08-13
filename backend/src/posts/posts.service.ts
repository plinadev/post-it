import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePostDto } from './dto/create-post.dto';
import * as path from 'path';
import * as admin from 'firebase-admin';
import { Post } from 'src/types/post';

type FirestoreUser = {
  username?: string;
  avatarUrl?: string | null;
};

@Injectable()
export class PostsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createPost(
    userId: string,
    dto: CreatePostDto,
    photo?: Express.Multer.File,
  ) {
    const db = this.firebaseService.getFirestore();

    // 1. Create new post
    const postRef = db.collection('posts').doc();
    let photoUrl: string | null = null;

    // 2. If photo exists, upload to Storage
    if (photo) {
      photoUrl = await this.savePhoto(userId, postRef.id, photo);
    }

    // 3. Post data
    const postData: Partial<Post> = {
      authorId: userId,
      title: dto.title,
      content: dto.content,
      photoUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      edited: false,
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
    };

    //4. Save to Firestore
    await postRef.set(postData);

    return { id: postRef.id, ...postData };
  }

  async editPost(
    userId: string,
    postId: string,
    dto: Partial<CreatePostDto>,
    photo?: Express.Multer.File,
  ) {
    const db = this.firebaseService.getFirestore();

    // 1. Fetch post
    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      throw new NotFoundException('Post not found');
    }

    const postData = postSnap.data() as Post;
    if (postData.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to edit this post');
    }

    let updatedPhotoUrl = postData.photoUrl || null;

    // 2. Handle new photo upload
    if (photo) {
      // Delete old photo if exists
      if (postData.photoUrl) {
        await this.deletePhoto(postData.photoUrl);
      }

      updatedPhotoUrl = await this.savePhoto(userId, postId, photo);
    }

    // 3. Prepare updated data
    const updateData: Partial<Post> = {
      edited: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (dto.title) updateData.title = dto.title;
    if (dto.content) updateData.content = dto.content;
    if (photo) updateData.photoUrl = updatedPhotoUrl;

    // 4. Update in Firestore
    await postRef.update(updateData);

    return {
      message: 'Post updated successfully',
      data: { ...postData, ...updateData },
    };
  }

  async getPostById(postId: string) {
    const db = this.firebaseService.getFirestore();

    // 1. Get the post
    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      throw new NotFoundException('Post not found');
    }

    const postData = postSnap.data() as Post;

    // 2. Get the author info
    const authorData: FirestoreUser = {
      username: 'Unknown',
      avatarUrl: null,
    };

    if (postData.authorId) {
      const userRef = db.collection('users').doc(postData.authorId);
      const userSnap = await userRef.get();

      if (userSnap.exists) {
        const user = userSnap.data() as FirestoreUser;
        authorData.username = user?.username || 'Unknown';
        authorData.avatarUrl = user?.avatarUrl || null;
      }
    }

    // 3. Return combined data
    return {
      id: postSnap.id,
      ...postData,
      author: authorData,
    };
  }

  async getPostsByUserId(userId: string) {
    const db = this.firebaseService.getFirestore();

    // 1. Fetch author info
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    type FirestoreUser = { username?: string; avatarUrl?: string | null };

    const author: FirestoreUser = {
      username: 'Unknown',
      avatarUrl: null,
    };

    if (userSnap.exists) {
      const user = userSnap.data() as FirestoreUser;
      author.username = user.username ?? 'Unknown';
      author.avatarUrl = user.avatarUrl ?? null;
    }

    // 2. Fetch posts for this user
    const postsSnap = await db
      .collection('posts')
      .where('authorId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const posts: Array<{ id: string } & Post> = [];
    postsSnap.forEach((doc) => {
      const postData = doc.data() as Post;
      posts.push({ id: doc.id, ...postData });
    });

    return {
      author,
      postsCount: posts.length,
      posts,
    };
  }

  async deletePost(userId: string, postId: string) {
    const db = this.firebaseService.getFirestore();

    // 1. Fetch the post
    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      throw new NotFoundException('Post not found');
    }

    const postData = postSnap.data() as Post;

    // 2. Check if user is author
    if (postData.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    // 3. Delete photo from Storage if exists
    if (postData.photoUrl) {
      await this.deletePhoto(postData.photoUrl);
    }

    // 4. Delete the post document
    await postRef.delete();

    return { message: 'Post deleted successfully' };
  }

  private async savePhoto(
    userId: string,
    postId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const storage = this.firebaseService.getStorage();
    const bucket = storage.bucket();

    const ext = path.extname(file.originalname) || '.jpg';
    const storagePath = `posts/${userId}/${postId}${ext}`;
    const storageFile = bucket.file(storagePath);

    await storageFile.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
    });

    return `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(storagePath)}`;
  }

  private async deletePhoto(photoUrl: string) {
    const storage = this.firebaseService.getStorage();
    const bucket = storage.bucket();

    const oldFilePath = decodeURIComponent(
      photoUrl.split(`/${bucket.name}/`)[1],
    );
    await bucket.file(oldFilePath).delete({ ignoreNotFound: true });
  }
}
