import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase.config";
import { doc, onSnapshot } from "firebase/firestore";
import { useLoadingStore } from "../loading/useLoadingState";

function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    setAuthReady(false);

    let unsubscribeFromFirestore: (() => void) | null = null;

    const unsubscribeFromAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);

      if (!firebaseUser) {
        clearUser();
        setLoading(false);
        setAuthReady(true);
        if (unsubscribeFromFirestore) unsubscribeFromFirestore();
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);

      // Listen for realtime updates in Firestore user doc
      unsubscribeFromFirestore = onSnapshot(
        userRef,
        (snap) => {
          const firestoreData = snap.exists() ? snap.data() : {};

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || null,
            phone: firebaseUser.phoneNumber || null,
            avatarUrl: firestoreData.avatarUrl ?? firebaseUser.photoURL ?? null,
            username: firestoreData.username ?? null,
            createdAt: firestoreData.createdAt ?? null,
          });
          setLoading(false);
          setAuthReady(true);
        },
        (error) => {
          console.error("Firestore listener error:", error);
          clearUser();
          setLoading(false);
          setAuthReady(true);
        }
      );
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
    };
  }, [setUser, clearUser, setAuthReady, setLoading]);

  return null;
}

export default AuthListener;
