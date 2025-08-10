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
declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  }
}
