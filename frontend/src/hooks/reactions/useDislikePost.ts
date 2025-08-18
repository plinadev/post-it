import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { dislikePost as dislikePostApi } from "../../services/reactionsService";
import type { Post, Reaction } from "../../types";

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  const { mutate: dislikePost, isPending: isDisliking } = useMutation({
    mutationFn: dislikePostApi,
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

  return { dislikePost, isDisliking };
};
