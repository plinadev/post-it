/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase.config";
import syncUserToFirestoreAndStore from "../utils/syncUserToFirestoreAndStore";
import type { User } from "../types";
import { useAuthStore } from "../state/user/useAuthStore";

//Email/Password Sign-Up
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { user: authUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(authUser);

    return await syncUserToFirestoreAndStore(authUser, {
      email,
    });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    throw error;
  }
};

//Email/Password Sign-In
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { user: authUser } = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return await syncUserToFirestoreAndStore(authUser);
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};

//Google OAuth Sign-In
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const { user: authUser } = await signInWithPopup(auth, googleProvider);

    return await syncUserToFirestoreAndStore(authUser, {
      email: authUser.email,
    });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

//Setup reCAPTCHA verifier for phone auth
export const setupRecaptcha = (elementId: string) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: (response: any) => {
      console.log("reCAPTCHA solved", response);
    },
  });
};

//Send SMS verification code
export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    if (!window.recaptchaVerifier) {
      throw new Error("reCAPTCHA not initialized");
    }

    return await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
  } catch (error) {
    console.error("Send Verification Code Error:", error);
    throw new Error("Failed to send verification code.");
  }
};

// Confirm SMS code and sign in
export const confirmVerificationCode = async (
  confirmationResult: any,
  verificationCode: string
): Promise<User> => {
  try {
    const result = await confirmationResult.confirm(verificationCode);
    return await syncUserToFirestoreAndStore(result.user, {
      phone: result.user.phoneNumber,
    });
  } catch (error) {
    console.error("Confirm Verification Code Error:", error);
    throw new Error("Invalid or expired verification code.");
  }
};

//Log user out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
    useAuthStore.getState().clearUser();
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
