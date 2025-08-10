import LogoutButton from "../components/LogoutButton";
import { useAuthStore } from "../state/user/useAuthStore";

function FeedPage() {
  const user = useAuthStore((state) => state.user);
  console.log(user);

  return (
    <>
      <p>Welcome, {user?.email || user?.phone}</p>
      <LogoutButton />
    </>
  );
}

export default FeedPage;
