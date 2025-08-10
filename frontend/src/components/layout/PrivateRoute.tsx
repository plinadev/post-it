import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../state/user/useAuthStore";
import Layout from "./Layout";
interface PrivateRouteProps {
  children: React.ReactNode;
}
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isAuthReady } = useAuthStore();

  const { pathname } = useLocation();
  if (!isAuthReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (pathname === "/create-username") return children;

  return <Layout>{children}</Layout>;
}
