import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createComment as createCommentApi } from "../../services/commentsService";
import type { Post, Comment } from "../../types";
import { useAuthStore } from "../../state/user/useAuthStore";
import { Timestamp } from "firebase/firestore";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: createCommentApi,
    onSuccess: (response) => {
      const newComment: Comment = {
        ...response.data,
        author: {
          username: user?.username || "Unknown",
          avatarUrl: user?.avatarUrl || null,
        },
        createdAt:
          response.data.createdAt && response.data.createdAt._seconds
            ? new Timestamp(
                response.data.createdAt._seconds,
                response.data.createdAt._nanoseconds
              )
            : Timestamp.now(),
      };

      queryClient.setQueriesData(
        { queryKey: ["comments"], exact: false },
        (
          oldData:
            | {
                data: Comment[];
                status: number;
              }
            | undefined
        ) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: [newComment, ...oldData.data],
          };
        }
      );

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

          if (oldData.data.id !== newComment.postId) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              commentsCount: (oldData.data.commentsCount || 0) + 1,
            },
          };
        }
      );

      toast.success("Comment was successfully created!");
    },
    onError: () => {
      toast.error(
        "Something went wrong while creating a comment! Try again later"
      );
    },
  });

  return { createComment, isCreating };
};
