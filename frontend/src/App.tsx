import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/auth/Signup";
import SigninPage from "./pages/auth/Signin";
import { Toaster } from "react-hot-toast";
import FeedPage from "./pages/Feed";
import CreateUsernamePage from "./pages/auth/CreateUsername";
import VerifyEmailPage from "./pages/auth/VerifyEmail";
import AuthListener from "./state/user/AuthListener";
import Loader from "./components/Loader";
import { useLoadingStore } from "./state/loading/useLoadingState";
import PublicRoute from "./components/layout/PublicRoute";
import PrivateRoute from "./components/layout/PrivateRoute";
import SearchPage from "./pages/Search";
import CreatePostPage from "./pages/CreatePost";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";

function App() {
  const loading = useLoadingStore((state) => state.isLoading);
  return (
    <div>
      {loading && <Loader />}
      <AuthListener />
      <BrowserRouter>
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
            path="/search"
            element={
              <PrivateRoute>
                <SearchPage />
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
            path="/profile"
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
  );
}

export default App;
