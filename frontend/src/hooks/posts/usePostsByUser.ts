import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPostsByUserId } from "../../services/postsService";
import { useLoadingStore } from "../../state/loading/useLoadingState";
import { useEffect } from "react";
export const usePostsByUser = () => {
  const { userId: userIdParam } = useParams();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const userId = userIdParam || "";

  const {
    data: profile,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getAllPostsByUserId(userId),
    enabled: Boolean(userId),
  });

  // Sync isFetching with global loading state
  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  return { profile, isFetching, error };
};
