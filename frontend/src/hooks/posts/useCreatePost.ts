import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost as createPostApi } from "../../services/postsService";
import type { Post } from "../../types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createPost, isPending: isCreating } = useMutation({
    mutationFn: createPostApi,
    onSuccess: (post) => {
      toast.success("Post was successfully created!");
      navigate("/profile");
    },
    onError: () => {
      toast.error(
        "Something went wrong while creating a post! Try again later"
      );
    },
  });

  return { createPost, isCreating };
};
