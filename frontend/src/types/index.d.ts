import type { Timestamp } from "firebase/firestore";

export type AuthFormErrors = {
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  phone?: string;
};

export type User = {
  uid: string;
  email: string | null;
  avatarUrl: string | null;
  phone: string | null;
  username: string | null;
  createdAt: Timestamp;
};

export type Post = {
  id: string;
  authorId: string;
  author: {
    username: string;
    avatarUrl: string | null;
  };
  title: string;
  content: string;
  photoUrl?: string | null;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  edited: boolean;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  userReaction: "like" | "dislike" | null;
};

export type Reaction = {
  postId: string;
  userId: string;
  type: "like" | "dislike";
  likesCount: number;
  dislikesCount: number;
};
declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  }
}
