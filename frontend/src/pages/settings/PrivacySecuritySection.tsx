import { useState } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa6";
import { changePassword, resetPassword } from "../../services/usersService";
import { FaExclamationTriangle } from "react-icons/fa";

function PrivacySecuritySection() {
  return (
    <section className="space-y-8">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <FaLock size={15} /> Privacy and security
      </h2>
      <ChangePasswordForm />
      <ForgotPasswordSection />
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <FaExclamationTriangle size={15} /> Danger zone
      </h2>
      <DeleteAccountSection />
    </section>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
  }>({});

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    let hasError = false;
    const newErrors: Record<string, string> = {};

    if (!currentPassword || currentPassword.length < 6) {
      newErrors.currentPassword =
        "Please enter your current password (min 6 chars)";
      hasError = true;
    }

    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
      hasError = true;
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword =
        "New password cannot be the same as current password";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const result = await changePassword(currentPassword, newPassword);
      toast.success(result.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setErrors({ currentPassword: "Passoword is incorrect" });
      } else {
        toast.error("Something went wrong! Try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="max-w-md space-y-3">
      <h3 className="font-semibold">Change password</h3>
      <div>
        <input
          type="password"
          placeholder="Current password"
          className="input input-bordered w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
        />
        {errors.currentPassword && (
          <span className="text-sm text-[var(--color-error)]">
            {errors.currentPassword}
          </span>
        )}
      </div>
      <div>
        <input
          type="password"
          placeholder="New password"
          className="input input-bordered w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
        {errors.newPassword && (
          <span className="text-sm text-[var(--color-error)]">
            {errors.newPassword}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-[40%]"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Change Password"
        )}
      </button>
    </form>
  );
}

function ForgotPasswordSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const { message } = await resetPassword(email);
      toast.success(message);
      setEmail("");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (error.message) {
        setError(error.message);
      } else {
        toast.error("Failed to send password reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-3">
      <h3 className="font-semibold">Forgot password</h3>
      <div>
        <input
          type="email"
          placeholder="Your email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        {error && (
          <span className="text-sm text-[var(--color-error)]">{error}</span>
        )}
      </div>
      <button
        onClick={handleForgotPassword}
        className="btn btn-primary w-[40%]"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Reset Password"
        )}
      </button>
    </div>
  );
}

function DeleteAccountSection() {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Call API to delete account
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Account deleted");
      // Then redirect to homepage or logout user
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" border-1 p-5 rounded-xl border-error">
      <h3 className="font-semibold mb-3">Delete account</h3>
      <button
        className="btn btn-error w-[40%]"
        onClick={() => document.getElementById("my_modal_3")?.showModal()}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Delete Account"
        )}
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box ">
          <form method="dialog" onSubmit={handleDeleteAccount}>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="mb-5">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete your account?
            </h3>
            <p>This action can not be undone</p>
          </div>
          <button
            className="btn btn-error w-full"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Delete Account"
            )}
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default PrivacySecuritySection;
