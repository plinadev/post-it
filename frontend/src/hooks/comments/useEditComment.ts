import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editComment as editCommentApi } from "../../services/commentsService";
import type { Comment } from "../../types";

export const useEditComment = () => {
  const queryClient = useQueryClient();

  const { mutate: editComment, isPending: isUpdating } = useMutation({
    mutationFn: editCommentApi,
    onSuccess: (updatedData) => {
      const updatedComment = updatedData.data;
      toast.success("Comment was successfully updated!");

      queryClient.setQueriesData(
        { queryKey: ["comments"], exact: false },
        (oldData: { status: number; data: Comment[] } | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((c) =>
              c.id === updatedComment.id ? { ...c, ...updatedComment } : c
            ),
          };
        }
      );
    },
    onError: () => {
      toast.error(
        "Something went wrong while updating a comment! Try again later"
      );
    },
  });

  return { editComment, isUpdating };
};
