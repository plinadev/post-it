import { useEffect } from "react";
import { auth } from "../../lib/firebase.config";
import { useNavigate } from "react-router-dom";

function VerifyEmailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();

      if (auth.currentUser?.emailVerified) {
        clearInterval(interval);
        navigate("/create-username");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-3 text-lg">
      <h1 className="text-4xl font-bold">Please verify your email!</h1>
      <p>
        We sent a verification email to{" "}
        <b className="text-[var(--color-info)]">{auth.currentUser?.email}</b>
      </p>
      <p>Check your inbox and click the verification link</p>
      <span className="loading loading-ring loading-xl mt-2 text-[var(--color-info)]"></span>
    </div>
  );
}

export default VerifyEmailPage;
