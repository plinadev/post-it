import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase.config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    const isNew = !snapshot.exists();
    if (isNew) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        avatarUrl: user.photoURL,
        phone: user.phoneNumber || null,
        username: null,
        createdAt: serverTimestamp(),
      });
    }

    return { user, isNew };
  } catch (error) {
    console.error("Google Sign-In Error: ", error);
    throw error;
  }
};
