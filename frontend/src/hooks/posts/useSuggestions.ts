import { useQuery } from "@tanstack/react-query";
import { getSuggestions } from "../../services/postsService";
import { useSearchParams } from "react-router-dom";

export const useSuggestions = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const limit = Number(searchParams.get("limit")) || 5;
  const {
    data: suggestions,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["suggestions", search, limit],
    queryFn: () => getSuggestions({ q: search, limit }),
  });

  return {
    suggestions,
    isFetching,
    error,
  };
};
