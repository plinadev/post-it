import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { dislikePost as dislikePostApi } from "../../services/reactionsService";
import type { Author, Post, Reaction } from "../../types";
import { useLocation } from "react-router-dom";

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { mutate: dislikePost, isPending: isDisliking } = useMutation({
    mutationFn: dislikePostApi,
    onSuccess: (data) => {
      const reactionData: Reaction = data.data;
      const pathname = location.pathname;

      // Feed/posts page
      if (pathname.includes("/")) {
        queryClient.setQueriesData(
          { queryKey: ["posts"], exact: false },
          (
            oldData:
              | {
                  posts: Post[];
                  total: number;
                  page: number;
                  totalPages: number;
                }
              | undefined
          ) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              posts: oldData.posts.map((post) =>
                post.id === reactionData.postId
                  ? {
                      ...post,
                      likesCount: reactionData.likesCount,
                      dislikesCount: reactionData.dislikesCount,
                      userReaction: reactionData.type,
                    }
                  : post
              ),
            };
          }
        );
      }

      // Profile page
      if (pathname.includes("/profile")) {
        queryClient.setQueriesData(
          { queryKey: ["profile"], exact: false },
          (
            oldData:
              | {
                  status: number;
                  data: {
                    author: Author;
                    postsCount: number;
                    posts: Post[];
                  };
                }
              | undefined
          ) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              data: {
                ...oldData.data,
                posts: oldData.data.posts.map((post) =>
                  post.id === reactionData.postId
                    ? {
                        ...post,
                        likesCount: reactionData.likesCount,
                        dislikesCount: reactionData.dislikesCount,
                        userReaction: reactionData.type,
                      }
                    : post
                ),
              },
            };
          }
        );
      }

      // Single post page
      if (pathname.includes("/post")) {
        queryClient.setQueriesData(
          { queryKey: ["post"], exact: false },
          (
            oldData:
              | {
                  status: number;
                  data: Post;
                }
              | undefined
          ) => {
            if (!oldData) return oldData;

            if (oldData.data.id !== reactionData.postId) return oldData;

            return {
              ...oldData,
              data: {
                ...oldData.data,
                likesCount: reactionData.likesCount,
                dislikesCount: reactionData.dislikesCount,
                userReaction: reactionData.type,
              },
            };
          }
        );
      }

      toast.success("You disliked a post");
    },
    onError: () => {
      toast.error(
        "Something went wrong while disliking a post! Try again later"
      );
    },
  });

  return { dislikePost, isDisliking };
};
