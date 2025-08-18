/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreatePostDto } from './dto/create-post.dto';
import * as path from 'path';
import * as admin from 'firebase-admin';
import { Post, PostHit } from 'src/types/post';
import { EditPostDto } from './dto/edit-post.dto';
import { algoliasearch, SearchClient } from 'algoliasearch';

type FirestoreUser = {
  username?: string;
  avatarUrl?: string | null;
};

export interface Author {
  username: string;
  avatarUrl?: string | null;
}

@Injectable()
export class PostsService {
  private client: SearchClient;
  private indexName: string;
  constructor(private readonly firebaseService: FirebaseService) {
    this.client = algoliasearch(
      process.env.ALGOLIA_APP_ID || '',
      process.env.ALGOLIA_SEARCH_KEY || '',
    );
    this.indexName = process.env.ALGOLIA_INDEX_NAME || '';
  }

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
    dto: Partial<EditPostDto>,
    photo?: Express.Multer.File,
  ) {
    const db = this.firebaseService.getFirestore();
    const postRef = db.collection('posts').doc(postId);
    const removePhoto = dto.removePhoto === 'true';
    const postSnap = await postRef.get();
    if (!postSnap.exists) throw new NotFoundException('Post not found');

    const postData = postSnap.data() as Post;
    if (postData.authorId !== userId)
      throw new ForbiddenException('Not allowed');

    // Prevent conflicting actions
    if (photo && removePhoto) {
      console.log(dto.removePhoto);
      throw new BadRequestException(
        'Cannot upload and remove photo simultaneously',
      );
    }

    let updatedPhotoUrl = postData.photoUrl || null;

    // Handle new photo upload
    if (photo) {
      if (!photo.mimetype.startsWith('image/')) {
        throw new BadRequestException('Invalid file type');
      }
      if (postData.photoUrl) await this.deletePhoto(postData.photoUrl);
      updatedPhotoUrl = await this.savePhoto(userId, postId, photo);
    }
    // Handle photo deletion
    else if (removePhoto && postData.photoUrl) {
      await this.deletePhoto(postData.photoUrl);
      updatedPhotoUrl = null;
    }

    // Prepare update
    const updateData: Partial<Post> = {
      edited: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (dto.title) updateData.title = dto.title;
    if (dto.content) updateData.content = dto.content;
    if (photo || dto.removePhoto) updateData.photoUrl = updatedPhotoUrl;

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
    await storageFile.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(storagePath)}?v=${Date.now()}`;
  }

  private async deletePhoto(photoUrl: string) {
    const storage = this.firebaseService.getStorage();
    const bucket = storage.bucket();

    const oldFilePath = decodeURIComponent(
      photoUrl.split(`/${bucket.name}/`)[1],
    );
    await bucket.file(oldFilePath).delete({ ignoreNotFound: true });
  }

  async getAllPosts(userId: string, search?: string, page = 1, limit = 10) {
    try {
      const result = await this.client.search<PostHit>({
        requests: [
          {
            indexName: this.indexName,
            query: search || '',
            page: page - 1,
            hitsPerPage: limit,
            attributesToRetrieve: [
              'title',
              'content',
              'authorId',
              'photoUrl',
              'createdAt',
              'updatedAt',
              'edited',
              'likesCount',
              'dislikesCount',
              'commentsCount',
            ],
          },
        ],
      });

      const searchResult: any = result.results[0];

      const hits = searchResult.hits as PostHit[];

      const authorIds: string[] = Array.from(
        new Set(
          hits.map((hit) => hit.authorId).filter((id): id is string => !!id), // type guard + remove falsy
        ),
      );

      const authorsData = await this.getAuthorsByIds(authorIds);

      const populatedPosts = searchResult.hits.map(
        (hit: {
          objectID: string;
          title: string;
          content: string;
          photoUrl?: string;
          createdAt: number | string;
          updatedAt?: number | string;
          edited?: boolean;
          likesCount?: number;
          dislikesCount?: number;
          commentsCount?: number;
          authorId: string;
        }) => ({
          id: hit.objectID,
          title: hit.title,
          content: hit.content,
          photoUrl: hit.photoUrl || null,
          createdAt: this.toFirestoreTimestamp(hit.createdAt),
          updatedAt: hit.updatedAt
            ? this.toFirestoreTimestamp(hit.updatedAt)
            : null,
          edited: hit.edited || false,
          likesCount: hit.likesCount || 0,
          dislikesCount: hit.dislikesCount || 0,
          commentsCount: hit.commentsCount || 0,
          author: authorsData[hit.authorId] || {
            username: 'Unknown',
            avatarUrl: null,
          },
        }),
      );
      const postsWithReactions = await this.attachUserReactions(
        populatedPosts,
        userId,
      );
      return {
        posts: postsWithReactions,
        total: searchResult.nbHits,
        page: searchResult.page + 1,
        totalPages: searchResult.nbPages,
        // processingTimeMS: searchResult.processingTimeMS,
      };
    } catch (error) {
      console.error('Algolia search error:', error);

      return await this.getAllPostsFirestore(search, page, limit);
    }
  }
  private async attachUserReactions(
    posts: Post[],
    userId: string,
  ): Promise<
    ((typeof posts)[0] & { userReaction: 'like' | 'dislike' | null })[]
  > {
    if (!userId) return posts.map((p) => ({ ...p, userReaction: null }));

    const db = this.firebaseService.getFirestore();

    const reactionSnaps = await db
      .collection('reactions')
      .where('userId', '==', userId)
      .where(
        'postId',
        'in',
        posts.map((p) => p.id),
      )
      .get();

    const reactionsMap: Record<string, 'like' | 'dislike'> = {};
    reactionSnaps.docs.forEach((doc) => {
      const r = doc.data() as { postId: string; type: 'like' | 'dislike' };
      reactionsMap[r.postId] = r.type;
    });

    return posts.map((p) => ({
      ...p,
      userReaction: reactionsMap[p.id!] || null,
    }));
  }

  async getSearchSuggestions(query: string, limit = 5) {
    try {
      const result = await this.client.search({
        requests: [
          {
            indexName: this.indexName,
            query,
            hitsPerPage: limit,
            attributesToRetrieve: ['title', 'content'],
            attributesToHighlight: ['title', 'content'],
            highlightPreTag: '<bold>',
            highlightPostTag: '</bold>',
          },
        ],
      });

      const searchResult: any = result.results[0];
      return {
        suggestions: searchResult.hits.map((hit: any) => ({
          id: hit.objectID,
          title: hit._highlightResult?.title?.value || hit.title,
          snippet:
            hit._highlightResult?.content?.value ||
            hit.content?.substring(0, 100),
        })),
      };
    } catch (error) {
      console.error('Algolia suggestions error:', error);
      throw new Error('Failed to get search suggestions');
    }
  }

  private async getAuthorsByIds(
    authorIds: string[],
  ): Promise<Record<string, FirestoreUser>> {
    if (!authorIds.length) return {};
    const db = this.firebaseService.getFirestore();

    const snapshot = await db
      .collection('users')
      .where(admin.firestore.FieldPath.documentId(), 'in', authorIds)
      .get();

    const authors: Record<string, FirestoreUser> = {};

    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreUser;
      authors[doc.id] = {
        username: data.username || 'Unknown',
        avatarUrl: data.avatarUrl ?? null,
      };
    });

    return authors;
  }
  private async getAllPostsFirestore(search?: string, page = 1, limit = 10) {
    const db = this.firebaseService.getFirestore();

    let posts: Array<PostHit & { id: string }> = [];
    let total = 0;

    // --- SEARCH MODE ---
    if (search) {
      // Build title + content queries (case-insensitive simulation using range)
      const titleQuery = db
        .collection('posts')
        .where('title', '>=', search)
        .where('title', '<=', search + '\uf8ff');

      const contentQuery = db
        .collection('posts')
        .where('content', '>=', search)
        .where('content', '<=', search + '\uf8ff');

      // Count matching docs
      const [titleCountSnap, contentCountSnap] = await Promise.all([
        titleQuery.count().get(),
        contentQuery.count().get(),
      ]);

      total = titleCountSnap.data().count + contentCountSnap.data().count;

      // Get paginated docs (merged + deduped)
      const [titleSnap, contentSnap] = await Promise.all([
        titleQuery
          .orderBy('createdAt', 'desc')
          .offset((page - 1) * limit)
          .limit(limit)
          .get(),
        contentQuery
          .orderBy('createdAt', 'desc')
          .offset((page - 1) * limit)
          .limit(limit)
          .get(),
      ]);

      const postsMap = new Map<string, any>();
      [...titleSnap.docs, ...contentSnap.docs].forEach((doc) => {
        postsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });

      posts = Array.from(postsMap.values()) as Array<PostHit & { id: string }>;
    }

    // --- NO SEARCH MODE ---
    else {
      // Get total count
      const totalSnap = await db.collection('posts').count().get();
      total = totalSnap.data().count;

      // Get paginated posts
      const snapshot = await db
        .collection('posts')
        .orderBy('likesCount', 'desc')
        .orderBy('commentsCount', 'desc')
        .orderBy('createdAt', 'desc')
        .offset((page - 1) * limit)
        .limit(limit)
        .get();

      posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<PostHit & { id: string }>;
    }

    // --- AUTHOR POPULATION ---
    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const authorsData = await this.getAuthorsByIds(authorIds);

    const populatedPosts = posts.map((p) => ({
      ...p,
      author: authorsData[p.authorId] || {
        username: 'Unknown',
        avatarUrl: null,
      },
    }));

    return {
      posts: populatedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  private toFirestoreTimestamp(value: any) {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      date = new Date(value); // ISO string
    } else if (typeof value === 'number') {
      date = new Date(value); // millis
    } else {
      return null;
    }

    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1e6;

    return { _seconds: seconds, _nanoseconds: nanoseconds };
  }
}
