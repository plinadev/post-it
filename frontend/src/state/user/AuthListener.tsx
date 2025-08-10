import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useLoadingStore } from "../loading/useLoadingState";

function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    setAuthReady(false);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      try {
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);

          const firestoreData = snap.exists() ? snap.data() : {};

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || null,
            phone: firebaseUser.phoneNumber || null,
            avatarUrl: firestoreData.avatarUrl ?? firebaseUser.photoURL ?? null,
            username: firestoreData.username ?? null,
            createdAt: firestoreData.createdAt ?? null,
          });
        } else {
          clearUser();
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        clearUser();
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setAuthReady, setLoading]);

  return null;
}

export default AuthListener;
