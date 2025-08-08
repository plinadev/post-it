import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo.svg";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import validateAuthForm from "../../utils/validateAuthForm";
import {
  signIn,
  sendVerificationCode,
  confirmVerificationCode,
  setupRecaptcha,
} from "../../services/authService";
import { auth } from "../../lib/firebase.config";
import type { AuthFormErrors } from "../../types";

function SigninPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");

  // Email/password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>({});

  // Phone auth state
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // General loading state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Email/password submit
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAuthForm(email, password);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      await signIn(email, password);
      if (!auth.currentUser?.emailVerified) {
        toast.error("Please verify your email before signing in");
        return;
      }
      toast.success("Signed in successfully");
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("User with such email does not exist");
      } else {
        toast.error("Something went wrong!");
      }
      console.error("Signin error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Phone auth send code
  const handleSendCode = async () => {
    try {
      setLoading(true);
      setupRecaptcha("recaptcha-container");
      const result = await sendVerificationCode(phone);
      setConfirmationResult(result);
      toast.success("Verification code sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // Phone auth verify code
  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const user = await confirmVerificationCode(confirmationResult, code);
      if (user && user.username) {
        navigate("/");
      } else if (user && !user.username) {
        navigate("/create-username");
      }
      toast.success(`Signed in successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-10 m-2">
      <div className="w-full max-w-2xl shadow-2xl p-10 rounded-2xl">
        {/* Title */}
        <div className="flex justify-self-center gap-3 mb-6">
          <h1 className="text-3xl text-center font-semibold">
            SIGN IN TO <span className="font-black">POST IT</span>
          </h1>
          <img src={logo} alt="hashtag" width={25} />
        </div>

        {/* Tabs */}
        <div role="tablist" className="tabs tabs-box mb-6">
          <button
            role="tab"
            className={`tab ${tab === "email" ? "tab-active" : ""}`}
            onClick={() => setTab("email")}
          >
            Email
          </button>
          <button
            role="tab"
            className={`tab ${tab === "phone" ? "tab-active" : ""}`}
            onClick={() => setTab("phone")}
          >
            Phone
          </button>
        </div>

        <div className="h-50">
          {/* Email/Password Form */}
          {tab === "email" && (
            <form className="space-y-4" onSubmit={handleEmailSignIn}>
              <div>
                <label className="label">
                  <span className="text-base label-text">Email*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span className="text-sm text-[var(--color-error)]">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="label">
                  <span className="text-base label-text">Password*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <span className="text-sm text-[var(--color-error)]">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary rounded w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {/* Phone Form */}
          {tab === "phone" && (
            <div className="flex flex-col gap-4">
              <input
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered self-center"
              />
              <button
                onClick={handleSendCode}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Send Code"
                )}
              </button>

              {confirmationResult && (
                <>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input input-bordered self-center"
                  />
                  <button
                    onClick={handleVerifyCode}
                    className="btn btn-info"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Verify Code"
                    )}
                  </button>
                </>
              )}

              <div id="recaptcha-container"></div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6">
          <span>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="underline hover:text-[var(--color-accent)]"
            >
              Click here to sign up
            </Link>
          </span>
          <div className="mt-6 justify-self-center">
            <GoogleSignInButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;
