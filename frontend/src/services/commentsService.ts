import type { Comment } from "../types";
import apiClient from "./apiClient";

//create comment
export const createComment = async ({
  postId,
  content,
  parentId,
}: {
  postId: string;
  content: string;
  parentId?: string | null;
}) => {
  try {
    const response = await apiClient.post(`/comments/${postId}`, {
      content,
      parentId,
    });

    return { status: response.status, data: response.data as Comment };
  } catch (error: any) {
    console.error(
      "Error creating a comment ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//update comment
export const editComment = async ({
  commentId,
  content,
}: {
  commentId: string;
  content: string;
}) => {
  try {
    const response = await apiClient.patch(`/comments/${commentId}`, {
      content,
    });

    return { status: response.status, data: response.data as Comment };
  } catch (error: any) {
    console.error(
      "Error updating a comment ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//delete comment
export const deleteComment = async ({ commentId }: { commentId: string }) => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);

    return { status: response.status, data: response.data };
  } catch (error: any) {
    console.error(
      "Error deleting a comment ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//get all comments by post id

export const getCommentsForPost = async ({ postId }: { postId: string }) => {
  try {
    const response = await apiClient.get(`/comments/${postId}`);

    return { status: response.status, data: response.data as Comment[] };
  } catch (error: any) {
    console.error(
      "Error getting comments for post",
      error.response?.data || error.message
    );
    throw error;
  }
};
