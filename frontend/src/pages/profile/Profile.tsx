import { usePostsByUser } from "../../hooks/posts/usePostsByUser";
import { PostsSkeleton } from "../../components/PostsSkeleton";
import { PostCard } from "../../components/Post";
import { ProfileHeaderSkeleton } from "../../components/ProfileHeaderSceleton";
import { EmptyPosts } from "./EmptyPosts";
import { ProfileHeader } from "./ProfileHeader";
import { useAuthStore } from "../../state/user/useAuthStore";

function ProfilePage() {
  const currentUser = useAuthStore((state) => state.user);
  const { profile, isFetching, error } = usePostsByUser();
  const user = profile?.data.author;
  const posts = profile?.data.posts;
  const postsCount = profile?.data.postsCount || 0;

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <ProfileHeaderSkeleton />
        <PostsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="alert alert-error shadow-lg">
          <div>
            <span>Error loading profile. Please try again later.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <ProfileHeader user={user} postsCount={postsCount} />

      {/* Posts Section */}
      <div>
        {postsCount > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-base-content">
                Recent Posts
              </h2>
              <div className="badge badge-primary badge-md">
                {postsCount} {postsCount === 1 ? "Post" : "Posts"}
              </div>
            </div>
            <div className="grid gap-6">
              {posts?.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={user}
                  byMe={currentUser?.uid === post.authorId}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyPosts username={user?.username} />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
