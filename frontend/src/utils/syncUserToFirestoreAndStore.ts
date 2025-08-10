import type { User as FirebaseUser } from "firebase/auth";
import { db } from "../lib/firebase.config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthStore } from "../state/user/useAuthStore";
import type { User } from "../types";

export default async function syncUserToFirestoreAndStore(
  authUser: FirebaseUser,
  extraData: Partial<User> = {}
) {
  const userRef = doc(db, "users", authUser.uid);
  const snapshot = await getDoc(userRef);

  let firestoreData;

  if (!snapshot.exists()) {
    firestoreData = {
      uid: authUser.uid,
      email: authUser.email || null,
      avatarUrl: null,
      phone: authUser.phoneNumber || null,
      username: null,
      createdAt: serverTimestamp(),
      ...extraData,
    };
    await setDoc(userRef, firestoreData);
  } else {
    firestoreData = snapshot.data();
  }

  const mergedUser: User = {
    uid: authUser.uid,
    email: authUser.email ?? firestoreData.email,
    avatarUrl: authUser.photoURL ?? firestoreData.avatarUrl,
    phone: authUser.phoneNumber ?? firestoreData.phone,
    username: firestoreData.username,
    createdAt: firestoreData.createdAt?.toDate?.() ?? new Date(),
  };

  useAuthStore.getState().setUser(mergedUser);

  return mergedUser;
}
