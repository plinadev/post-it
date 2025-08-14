import { useMutation } from "@tanstack/react-query";
import { createPost as createPostApi } from "../../services/postsService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/user/useAuthStore";

export const useCreatePost = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { mutate: createPost, isPending: isCreating } = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      toast.success("Post was successfully created!");
      navigate(`/profile/${user?.uid}`);
    },
    onError: () => {
      toast.error(
        "Something went wrong while creating a post! Try again later"
      );
    },
  });

  return { createPost, isCreating };
};
