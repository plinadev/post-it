import { useMutation } from "@tanstack/react-query";
import { editPost as editPostApi } from "../../services/postsService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/user/useAuthStore";

export const useEditPost = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { mutate: editPost, isPending: isUpdating } = useMutation({
    mutationFn: editPostApi,
    onSuccess: () => {
      toast.success("Post was successfully updated!");
      navigate(`/profile/${user?.uid}`);
    },
    onError: () => {
      toast.error(
        "Something went wrong while updating a post! Try again later"
      );
    },
  });

  return { editPost, isUpdating };
};
