import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost as deletePostApi } from "../../services/postsService";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useLoadingStore } from "../../state/loading/useLoadingState";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      toast.success("Post was successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["profile"], exact: false });
    },
    onError: () => {
      toast.error(
        "Something went wrong while deleting a post! Try again later"
      );
    },
  });
  useEffect(() => {
    setLoading(isDeleting);
  }, [isDeleting, setLoading]);

  return { deletePost, isDeleting };
};
