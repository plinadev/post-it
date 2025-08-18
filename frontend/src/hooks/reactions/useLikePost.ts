import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { likePost as likePostApi } from "../../services/reactionsService";
import type { Post, Reaction } from "../../types";

export const useLikePost = () => {
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: likePostApi,
    onSuccess: (data) => {
      const reactionData: Reaction = data.data;
      queryClient.setQueriesData(
        { queryKey: ["posts"], exact: false },
        (
          oldData:
            | { posts: Post[]; total: number; page: number; totalPages: number }
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
    },
    onError: () => {
      toast.error("Something went wrong while liking a post! Try again later");
    },
  });

  return { likePost, isLiking };
};
