import { useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import { auth } from "../lib/firebase.config";
import { useAuthStore } from "../state/user/useAuthStore";

function FeedPage() {
  const user = useAuthStore((state) => state.user);
  const authUser = auth.currentUser;
  useEffect(() => {
    const getToken = async () => {
      const token = await authUser?.getIdToken(true);

      console.log("TOKEN: ", token);
    };

    getToken();
  }, [authUser]);

  return (
    <>
      <p>Welcome, {user?.email || user?.phone}</p>
      <LogoutButton />
    </>
  );
}

export default FeedPage;
