import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AuthFormErrors } from "../../types";
import logo from "../../assets/logo.svg";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function SigninPage() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen p-10 m-2 ">
      <form
        className="space-y-4 w-full max-w-2xl shadow-2xl p-10 rounded-2xl"
        // onSubmit={handleSubmit}
      >
        <div className="flex justify-self-center gap-3">
          <h1 className="text-3xl text-center font-semibold">
            SIGN IN TO
            <span className="font-black"> POST IT</span>
          </h1>
          <img src={logo} alt="hashtag" width={25} />
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Email*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your email"
            className="w-full input input-bordered "
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
            className="w-full input input-bordered "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-sm text-[var(--color-error)]">
              {errors.password}
            </span>
          )}
        </div>

        <div>
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
          <span>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="underline hover:text-[var(--color-accent)]"
            >
              Click here to sign up
            </Link>{" "}
          </span>{" "}
          <div className="mt-10 justify-self-center">
            <GoogleSignInButton />
          </div>
        </div>
      </form>
    </div>
  );
}
export default SigninPage;
