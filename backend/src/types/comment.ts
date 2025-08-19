import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type Comment = Partial<{
  id: string;
  postId: string;
  userId: string;
  content: string;
  edited: boolean;
  parentId?: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue | null;
}>;
