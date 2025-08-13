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
  author: {
    username: string;
    avatarUrl: string | null;
  };
  title: string;
  content: string;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  edited: boolean;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
};

declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  }
}
