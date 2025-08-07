import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import type { AuthFormErrors } from "../../types";

function CreateUsernamePage() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen p-10 m-2 ">
      <form
        className="space-y-4 w-full max-w-2xl shadow-2xl p-10 rounded-2xl"
        // onSubmit={handleSubmit}
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
              {errors.email}
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
