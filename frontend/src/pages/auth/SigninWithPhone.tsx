import { useState } from "react";
import {
  confirmVerificationCode,
  sendVerificationCode,
  setupRecaptcha,
} from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function SigninWithPhonePage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const navigate = useNavigate();
  const handleSendCode = async () => {
    try {
      setupRecaptcha("recaptcha-container");
      const result = await sendVerificationCode(phone);
      setConfirmationResult(result);
      toast.success("Verification code sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send code");
    }
  };

  const handleVerifyCode = async () => {
    try {
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
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="tel"
        placeholder="+1234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input input-bordered"
      />
      <button onClick={handleSendCode} className="btn btn-primary">
        Send Code
      </button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input input-bordered"
          />
          <button onClick={handleVerifyCode} className="btn btn-success">
            Verify Code
          </button>
        </>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}
export default SigninWithPhonePage;
