import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/postsService";
import { useSearchParams } from "react-router-dom";

export const usePosts = () => {
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

  return {
    posts,
    isFetching,
    error,
  };
};
