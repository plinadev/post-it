import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export type Post = Partial<{
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
}>;
