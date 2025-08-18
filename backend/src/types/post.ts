import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export type Post = Partial<{
  id: string;
  authorId: string;
  title: string;
  content: string;
  photoUrl: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  edited: boolean;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  userReaction: 'like' | 'dislike' | null;
}>;
export interface PostHit {
  objectID: string;
  title: string;
  content: string;
  authorId: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  edited?: boolean;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
}
