const USERNAME_REGEX = /^[a-z0-9_]+$/; // only lowercase letters, digits, underscores

export const validateUsername = (username: string) => {
  const trimmed = username.trim();

  if (trimmed.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (trimmed.length > 20) {
    return "Username must be less than 20 characters";
  }
  if (/\s/.test(trimmed)) {
    return "Username cannot contain spaces";
  }
  if (!USERNAME_REGEX.test(trimmed)) {
    return "Username can only contain lowercase letters, numbers, and underscores";
  }
  return null;
};
