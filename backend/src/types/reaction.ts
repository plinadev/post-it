import { Timestamp } from 'firebase-admin/firestore';

export type Reaction = {
  id: string; // a mix of post id and user id
  postId: string;
  userId: string;
  type: 'like' | 'dislike';
  createdAt: Timestamp;
};
