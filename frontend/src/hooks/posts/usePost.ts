import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../services/postsService";
import { useLoadingStore } from "../../state/loading/useLoadingState";
import { useEffect } from "react";
export const usePost = () => {
  const { postId: postIdParam } = useParams();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const postId = postIdParam || "";

  const {
    data: post,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId),
  });

  // Sync isFetching with global loading state
  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  return { post, isFetching, error };
};
