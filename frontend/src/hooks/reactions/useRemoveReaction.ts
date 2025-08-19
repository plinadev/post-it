import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeReaction as removeReactionApi } from "../../services/reactionsService";
import type { Author, Post, Reaction } from "../../types";
import { useLocation } from "react-router-dom";

export const useRemoveReaction = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { mutate: removeReaction, isPending: isRemoving } = useMutation({
    mutationFn: removeReactionApi,
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
                      userReaction: null,
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
                        userReaction: null,
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
                userReaction: null,
              },
            };
          }
        );
      }

      toast.success("Reaction removed");
    },
    onError: () => {
      toast.error(
        "Something went wrong while removing reaction! Try again later"
      );
    },
  });

  return { removeReaction, isRemoving };
};
