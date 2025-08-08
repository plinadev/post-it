import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state/user/useAuthStore";
interface PrivateRouteProps {
  children: React.ReactNode;
}
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
