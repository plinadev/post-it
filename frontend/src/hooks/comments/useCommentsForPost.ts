import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getCommentsForPost } from "../../services/commentsService";
export const useCommentsForPost = () => {
  const { postId: postIdParam } = useParams();

  const postId = postIdParam || "";

  const {
    data: comments ,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPost({ postId }),
    enabled: Boolean(postId),
  });

  return { comments, isFetching, error };
};
