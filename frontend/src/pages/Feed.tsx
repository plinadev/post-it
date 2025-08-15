import { useState } from "react";

import { useAuthStore } from "../state/user/useAuthStore";
import { usePosts } from "../hooks/posts/usePosts";
import { PostsSkeleton } from "../components/PostsSkeleton";
import type { Post } from "../types";
import { PostCard } from "../components/Post";
import { FaPen } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
          <FaPen className="text-base-content/40" size={25} />
        </div>
        <h3 className="text-2xl font-semibold text-base-content mb-3">
          No posts yet
        </h3>
        <p className="text-base-content/60 text-lg">Check back later!</p>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const user = useAuthStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number(searchParams.get("limit")) || 10;
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const { posts, isFetching, error } = usePosts();

  const totalPages = Math.ceil((posts?.total || 0) / limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {isFetching && <PostsSkeleton />}

      {error && !isFetching && (
        <div className="alert alert-error shadow-lg">
          <span>Error loading feed. Please try again later.</span>
        </div>
      )}

      {!isFetching && !error && (
        <>
          {posts?.posts.length > 0 ? (
            <>
              <div className="grid gap-6">
                {posts.posts.map((post: Post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    author={post.author}
                    byMe={user?.uid === post.authorId}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="join">
                    {Array.from({ length: totalPages }, (_, idx) => {
                      const pageNumber = idx + 1;
                      return (
                        <button
                          key={pageNumber}
                          className={`join-item btn btn-sm ${
                            page === pageNumber ? "btn-active" : ""
                          }`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </div>
  );
}
