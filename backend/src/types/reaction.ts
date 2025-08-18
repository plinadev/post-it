export type Reaction = {
  id: string; // a mix of post id and user id
  postId: string;
  userId: string;
  type: 'like' | 'dislike';
  createdAt: FirebaseFirestore.Timestamp;
};
