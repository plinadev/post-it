import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/auth/Signup";
import SigninPage from "./pages/auth/Signin";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import FeedPage from "./pages/Feed";
import CreateUsernamePage from "./pages/auth/CreateUsername";
import VerifyEmailPage from "./pages/auth/VerifyEmail";
import AuthListener from "./state/user/AuthListener";
import Loader from "./components/Loader";
import { useLoadingStore } from "./state/loading/useLoadingState";
import PublicRoute from "./components/layout/PublicRoute";
import PrivateRoute from "./components/layout/PrivateRoute";
import ProfilePage from "./pages/profile/Profile";
import SettingsPage from "./pages/settings/Settings";
import EditPostPage from "./pages/edit-post/EditPost";
import ScrollToTop from "./components/ScrollToTop";
import CreatePostPage from "./pages/create-post/CreatePost";
import PostPage from "./pages/post/PostPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
function App() {
  const loading = useLoadingStore((state) => state.isLoading);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <div>
        {loading && <Loader />}
        <AuthListener />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SigninPage />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-email"
              element={
                <PublicRoute>
                  <VerifyEmailPage />
                </PublicRoute>
              }
            />
            <Route
              path="/create-username"
              element={
                <PrivateRoute>
                  <CreateUsernamePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <FeedPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreatePostPage />
                </PrivateRoute>
              }
            />
            <Route
              path="post/:postId"
              element={
                <PrivateRoute>
                  <PostPage />
                </PrivateRoute>
              }
            />
            <Route
              path="post/:postId/edit"
              element={
                <PrivateRoute>
                  <EditPostPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
