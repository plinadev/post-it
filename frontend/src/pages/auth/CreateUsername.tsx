import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import type { AuthFormErrors } from "../../types";
import toast from "react-hot-toast";
import { createUsername } from "../../services/usersService";
import { validateUsername } from "../../utils/validateUsername";
import { StatusCodes } from "http-status-codes";

function CreateUsernamePage() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateUsername(username);
    if (validationError) {
      setErrors({ username: validationError });
      return;
    }

    try {
      setLoading(true);
      const result = await createUsername(username);
      console.log(result);
      if (result.status === StatusCodes.CREATED) {
        toast.success(result.data.message || "Username set successfully");
        navigate("/profile");
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === StatusCodes.CONFLICT) {
        setErrors({
          username: error.response.data.message || "Username already taken",
        });
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen p-10 m-2 ">
      <form
        className="space-y-4 w-full max-w-2xl shadow-2xl p-10 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-self-center gap-3">
          <h1 className="text-3xl text-center font-semibold">
            CREATE USERNAME
          </h1>
          <img src={logo} alt="hashtag" width={25} />
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Username*</span>
          </label>
          <input
            type="text"
            placeholder="Enter unique username"
            className="w-full input input-bordered "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <span className="text-sm text-[var(--color-error)]">
              {errors.username}
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
              "Create Username"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUsernamePage;
