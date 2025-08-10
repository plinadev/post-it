import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logOut } from "../services/authService";
import toast from "react-hot-toast";
import { useLoadingStore } from "../state/loading/useLoadingState";

function LogoutButton() {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      setLoading(true);

      await logOut();
      navigate("/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button type="button" className="btn btn-primary" onClick={handleLogout}>
      <FiLogOut />
      Log Out
    </button>
  );
}

export default LogoutButton;
