import type { Post } from "../types";
import apiClient from "./apiClient";

//create post
export const createPost = async ({
  title,
  content,
  photoFile,
}: {
  title: string;
  content: string;
  photoFile?: File | null;
}) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (photoFile) formData.append("photo", photoFile);

    const response = await apiClient.post("/posts", formData);

    return { status: response.status, data: response.data as Post };
  } catch (error: any) {
    console.error(
      "Error creating a post ",
      error.response?.data || error.message
    );
  }
};

//edit post

//get post by id

//get all posts by user id

//delete post
