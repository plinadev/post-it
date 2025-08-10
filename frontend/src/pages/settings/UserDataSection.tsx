import { useState } from "react";
import toast from "react-hot-toast";

function UserDataSection() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ username?: string; phone?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!phone.match(/^\+?\d{10,15}$/))
      newErrors.phone = "Enter valid phone number with country code";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      // Call update user data API
      await new Promise((r) => setTimeout(r, 1000)); // mock async
      toast.success("User data updated!");
    } catch {
      toast.error("Failed to update user data");
    } finally {
      setLoading(false);
    }
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files[0]);
      // Here you would upload avatar to storage and update profile
      toast.success("Avatar selected! Implement upload logic.");
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Avatar</h2>
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      {avatar && <p>Selected file: {avatar.name}</p>}
      <h2 className="text-xl font-semibold mb-3">User data</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
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
        <div>
          <label className="block mb-1 font-medium" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            className="input input-bordered w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            placeholder="+1234567890"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </section>
  );
}
export default UserDataSection;
