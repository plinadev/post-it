import type { AuthFormErrors } from "../types";

export default function validateAuthForm(
  email: string,
  password: string,
  passwordConfirm?: string
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (passwordConfirm !== undefined) {
    if (!passwordConfirm) {
      errors.passwordConfirm = "Password confirmation is required";
    } else if (passwordConfirm !== password) {
      errors.passwordConfirm = "Passwords do not match";
    }
  }

  return errors;
}
