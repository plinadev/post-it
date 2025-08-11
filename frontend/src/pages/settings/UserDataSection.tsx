import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa6";
import { useAuthStore } from "../../state/user/useAuthStore";
import { updateUserData } from "../../services/usersService";
import placeholder from "../../assets/placeholder.svg";
import { validateUsername } from "../../utils/validateUsername";
import { logOut } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function UserDataSection() {
  const user = useAuthStore((state) => state.user);

  // Current form values
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  // Store original values to compare against
  const [originalValues, setOriginalValues] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    phone?: string;
    email?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  // Update original values when user data changes (e.g., after successful update)
  useEffect(() => {
    if (user) {
      const newOriginalValues = {
        username: user.username || "",
        phone: user.phone || "",
        email: user.email || "",
      };
      setOriginalValues(newOriginalValues);
      setUsername(newOriginalValues.username);
      setPhone(newOriginalValues.phone);
      setEmail(newOriginalValues.email);
    }
  }, [user]);

  useEffect(() => {
    if (avatar) {
      const url = URL.createObjectURL(avatar);
      setAvatarPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setAvatarPreviewUrl(null);
    }
  }, [avatar]);

  // Detect what fields have actually changed
  const getChangedFields = () => {
    const changedFields: {
      username?: string;
      phone?: string;
      email?: string;
      avatarFile?: File;
    } = {};

    if (username.trim() !== originalValues.username) {
      changedFields.username = username.trim();
    }

    if (phone.trim() !== originalValues.phone) {
      changedFields.phone = phone.trim();
    }

    if (email.trim() !== originalValues.email) {
      changedFields.email = email.trim();
    }

    // Avatar is always considered "changed" if a file is selected
    if (avatar) {
      changedFields.avatarFile = avatar;
    }

    return changedFields;
  };

  // Check if there are any changes to enable/disable submit button
  const hasChanges = () => {
    const changedFields = getChangedFields();
    return Object.keys(changedFields).length > 0;
  };

  const validate = (fieldsToValidate: Record<string, any>) => {
    const newErrors: typeof errors = {};

    // Only validate fields that are being updated
    if ("username" in fieldsToValidate) {
      const usernameErrors = validateUsername(fieldsToValidate.username);
      if (usernameErrors) {
        newErrors.username = usernameErrors;
      }
    }

    if ("phone" in fieldsToValidate && fieldsToValidate.phone) {
      if (!/^\+?\d{10,15}$/.test(fieldsToValidate.phone)) {
        newErrors.phone = "Enter valid phone number with country code";
      }
    }

    if ("email" in fieldsToValidate && fieldsToValidate.email) {
      if (!/^\S+@\S+\.\S+$/.test(fieldsToValidate.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const changedFields = getChangedFields();

    // Don't submit if nothing has changed
    if (Object.keys(changedFields).length === 0) {
      toast.error("No changes detected");
      return;
    }

    // Only validate changed fields
    const validationErrors = validate(changedFields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      await updateUserData(changedFields);
      toast.success("User data updated!");
      setErrors({});

      // Update original values after successful save
      setOriginalValues({
        username: username.trim(),
        phone: phone.trim(),
        email: email.trim(),
      });

      // Clear avatar selection after successful upload
      setAvatar(null);

      // If email or phone changed, log the user out
      if (changedFields.email || changedFields.phone) {
        toast("Your session will end due to critical changes.");
        await logOut();
        navigate("/signin");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files[0]);
      toast.success("Avatar selected!");
    }
  };

  const handleReset = () => {
    setUsername(originalValues.username);
    setPhone(originalValues.phone);
    setEmail(originalValues.email);
    setAvatar(null);
    setErrors({});
    toast.success("Changes reverted");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <FaUser size={15} /> User data
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border p-5 mb-5 rounded-xl flex gap-7 items-center">
          <img
            src={avatarPreviewUrl ?? user?.avatarUrl ?? placeholder}
            alt="profile picture"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold mb-3">Avatar</h3>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            {avatar && (
              <p className="text-sm text-gray-600 mt-1">
                Selected file: {avatar.name}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-md">
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
            {username.trim() !== originalValues.username && (
              <span className="text-orange-500 text-xs ml-2">• Modified</span>
            )}
          </label>
          <input
            id="username"
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="max-w-md">
          <label className="block mb-1 font-medium" htmlFor="phone">
            Phone
            {phone.trim() !== originalValues.phone && (
              <span className="text-orange-500 text-xs ml-2">• Modified</span>
            )}
          </label>
          <input
            id="phone"
            className="input input-bordered w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            placeholder="Add phone number (ex. +33194249999)"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="max-w-md">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
            {email.trim() !== originalValues.email && (
              <span className="text-orange-500 text-xs ml-2">• Modified</span>
            )}
          </label>
          <input
            id="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Add email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className={`btn btn-primary w-[40%] ${
              !hasChanges() ? "btn-disabled" : ""
            }`}
            disabled={loading || !hasChanges()}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              `Save${
                hasChanges()
                  ? ` (${Object.keys(getChangedFields()).length} change${
                      Object.keys(getChangedFields()).length > 1 ? "s" : ""
                    })`
                  : ""
              }`
            )}
          </button>

          {hasChanges() && (
            <button
              type="button"
              className="btn btn-ghost "
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default UserDataSection;
