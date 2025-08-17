import { PostCard } from "../../components/Post";
import { PostSkeleton } from "../../components/PostSkeleton";
import { usePost } from "../../hooks/posts/usePost";
import { useAuthStore } from "../../state/user/useAuthStore";
import type { Post } from "../../types";
import CommentsSection from "./CommentsSection";

function PostPage() {
  const user = useAuthStore((state) => state.user);
  const { post, isFetching } = usePost();
  const postData = post?.data as Post;
  const authorData = post?.data.author;
  if (isFetching) return <PostSkeleton />;
  return (
    <div className="flex flex-col gap-3  ">
      <PostCard
        post={postData}
        author={authorData}
        byMe={user?.uid === postData.authorId}
        isClickable={false}
      />
      <CommentsSection />
    </div>
  );
}

export default PostPage;
