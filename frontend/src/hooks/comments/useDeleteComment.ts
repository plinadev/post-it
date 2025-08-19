import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteComment as deleteCommentApi } from "../../services/commentsService";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"], exact: false });

      queryClient.invalidateQueries({ queryKey: ["comments"], exact: false });
      toast.success("Comment was successfully deleted!");
    },
    onError: () => {
      toast.error(
        "Something went wrong while deleting a comment! Try again later"
      );
    },
  });

  return { deleteComment, isDeleting };
};
