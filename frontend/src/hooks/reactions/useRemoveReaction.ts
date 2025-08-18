import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeReaction as removeReactionApi } from "../../services/reactionsService";
import type { Post, Reaction } from "../../types";

export const useRemoveReaction = () => {
  const queryClient = useQueryClient();

  const { mutate: removeReaction, isPending: isRemoving } = useMutation({
    mutationFn: removeReactionApi,
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
                    userReaction: null,
                  }
                : post
            ),
          };
        }
      );
    },
    onError: () => {
      toast.error(
        "Something went wrong while removing reaction! Try again later"
      );
    },
  });

  return { removeReaction, isRemoving };
};
