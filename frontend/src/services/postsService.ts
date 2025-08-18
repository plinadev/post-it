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
    throw error;
  }
};

//edit post
export const editPost = async ({
  id,
  title,
  content,
  photoFile,
  removePhoto,
}: {
  id: string;
  title: string;
  content: string;
  photoFile?: File | null;
  removePhoto: boolean;
}) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("removePhoto", String(removePhoto));
    if (photoFile) formData.append("photo", photoFile);

    const response = await apiClient.patch(`/posts/${id}`, formData);

    return { status: response.status, data: response.data as Post };
  } catch (error: any) {
    console.error(
      "Error occured while post edit ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//get all posts
export const getAllPosts = async ({
  search,
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await apiClient.get(`/posts?${params.toString()}`);

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching posts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//get posts suggestions
export const getSuggestions = async ({
  q,
  limit = 5,
}: {
  q: string;
  limit?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    params.append("limit", limit.toString());

    const response = await apiClient.get(
      `/posts/suggestions?${params.toString()}`
    );

    return response.data.suggestions;
  } catch (error: any) {
    console.error(
      "Error fetching suggestions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

//get post by id
export const getPostById = async (postId: string) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    const data = response.data[0];
    return {
      status: response.status,
      data: data as {
        author: {
          username: string;
          avatarUrl: string | null;
        };
      } & Post,
    };
  } catch (error: any) {
    console.error(
      "Error fetching post ",
      error.response?.data || error.message
    );
    throw error;
  }
};
//get all posts by user id
export const getAllPostsByUserId = async (userId: string) => {
  try {
    const response = await apiClient.get(`/posts/user/${userId}`);
    return {
      status: response.status,
      data: response.data as {
        author: {
          username: string;
          avatarUrl: string | null;
        };
        postsCount: number;
        posts: Post[];
      },
    };
  } catch (error: any) {
    console.error(
      "Error fetching posts ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//delete post
export const deletePost = async (id: string) => {
  try {
    const response = await apiClient.delete(`/posts/${id}`);
    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error(
      "Error deleting post ",
      error.response?.data || error.message
    );
    throw error;
  }
};
