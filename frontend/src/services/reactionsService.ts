import apiClient from "./apiClient";

export const likePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/reactions/${postId}/like`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error liking post ", error.response?.data || error.message);
    throw error;
  }
};

export const dislikePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/reactions/${postId}/dislike`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "Error disliking post ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const removeReaction = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/reactions/${postId}`);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "Error removing post reaction",
      error.response?.data || error.message
    );
    throw error;
  }
};
