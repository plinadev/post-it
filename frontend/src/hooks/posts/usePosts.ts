import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/postsService";
import { useLoadingStore } from "../../state/loading/useLoadingState";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const usePosts = () => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const {
    data: posts,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["posts", search, page, limit],
    queryFn: () => getAllPosts({ search, page, limit }),
  });

  // Sync isFetching with global loading state
  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  return {
    posts,
    isFetching,
    error,
  };
};
