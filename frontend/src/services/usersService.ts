import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import apiClient from "./apiClient";

export const createUsername = async (username: string) => {
  try {
    const response = await apiClient.post("/users/me/set-username", {
      username,
    });
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(
      "Error setting username: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const auth = getAuth();
  if (!auth.currentUser?.email) throw new Error("No user logged in");

  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    currentPassword
  );
  try {
    await reauthenticateWithCredential(auth.currentUser, credential);

    await updatePassword(auth.currentUser, newPassword);
    return {
      status: 200,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password: ", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || !currentUser.email) {
    throw new Error("You must be logged in to reset your password.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCurrentEmail = currentUser.email.trim().toLowerCase();

  if (normalizedCurrentEmail !== normalizedEmail) {
    throw new Error("The provided email does not match your account.");
  }

  await sendPasswordResetEmail(auth, normalizedEmail);
  return { message: `Password reset email was sent to ${normalizedEmail}` };
};

interface UpdateUserDataParams {
  username?: string;
  email?: string;
  phone?: string;
  avatarFile?: File;
}

export const updateUserData = async ({
  username,
  email,
  phone,
  avatarFile,
}: UpdateUserDataParams) => {
  try {
    const formData = new FormData();
    if (username) formData.append("username", username);
    if (email) formData.append("email", email);
    if (phone) formData.append("phone", phone);
    if (avatarFile) formData.append("avatar", avatarFile);
    const response = await apiClient.put("/users/me/update", formData);

    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(
      "Error updating user data: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const response = await apiClient.delete("/users/me");
    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
