// components/routing/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../state/user/useAuthStore";
import type React from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}
export default function PublicRoute({ children }: PublicRouteProps) {
  const { user, isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
