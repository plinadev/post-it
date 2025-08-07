import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/auth/Signup";
import SigninPage from "./pages/auth/Signin";
import { Toaster } from "react-hot-toast";
import FeedPage from "./pages/Feed";
import CreateUsernamePage from "./pages/auth/CreateUsername";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/create-username" element={<CreateUsernamePage />} />
        <Route path="/" element={<FeedPage />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
