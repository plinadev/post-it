import { PiChatCircle, PiHeart, PiHeartBreak } from "react-icons/pi";
import placeholder from "../assets/placeholder.svg";
import type { Post } from "../types";
import { formatDate } from "../utils/formatDate";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FaPen, FaTrash } from "react-icons/fa6";
import { useDeletePost } from "../hooks/posts/useDeletePost";

type Author = {
  username: string;
  avatarUrl: string | null;
};

type PostCardProps = {
  post: Post;
  author: Author | undefined;
  byMe: boolean;
  isClickable?: boolean;
};

export const PostCard = ({
  post,
  author,
  byMe,
  isClickable = true,
}: PostCardProps) => {
  const { deletePost, isDeleting } = useDeletePost();
  const navigate = useNavigate();

  const handleDeletePost = async () => {
    deletePost(post.id);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isClickable) return;

    const target = e.target as HTMLElement;

    if (
      target.closest(
        'a, button, input, p, textarea, select, label, .dropdown, [role="button"], [data-no-nav]'
      )
    ) {
      return;
    }

    // Ignore if user is selecting text
    const sel = window.getSelection?.();
    if (sel && sel.toString()) return;

    navigate(`/post/${post.id}`);
  };

  const handleProfileRedirect = () => {
    navigate(`/profile/${post.authorId}`);
  };
  return (
    <div
      onClick={handleCardClick}
      tabIndex={isClickable ? 0 : -1}
      className={`card bg-base-100 ${
        isClickable
          ? "cursor-pointer hover:shadow-xl hover:border-base-300"
          : ""
      }  transition-all duration-300 border border-base-200 `}
    >
      <div className="card-body">
        {/* Post Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-15 h-15 rounded-full">
                <img
                  src={author?.avatarUrl || placeholder}
                  alt={author?.username || "User avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p
                className="font-semibold text-base-content text-lg cursor-pointer hover:underline"
                onClick={handleProfileRedirect}
              >
                {author?.username}
              </p>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span>{formatDate(post.createdAt)}</span>
                {post.edited && (
                  <>
                    <span>•</span>
                    <span className="text-stone-300">Edited</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {byMe && (
            <div className="dropdown dropdown-right self-start" data-no-nav>
              <div tabIndex={0} role="button" className="bg-none w-min">
                <BsThreeDots size={20} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm"
              >
                <li>
                  <Link to={`/post/${post.id}/edit/`}>
                    <FaPen /> Edit
                  </Link>
                </li>
                <li>
                  <button onClick={handleDeletePost} disabled={isDeleting}>
                    <FaTrash />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <h2 className="card-title text-lg mb-3 text-base-content leading-tight">
            {post.title}
          </h2>
          <p className="text-base-content/80 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Post Image */}
        {post.photoUrl && (
          <figure className="mb-4">
            <img
              src={post.photoUrl}
              alt="Post"
              className="w-full h-64 object-cover rounded-lg border border-base-300"
            />
          </figure>
        )}

        {/* Post Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-base-200 text-stone-500">
          <div
            className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-lg transition ease-in-out duration-300"
            data-no-nav
          >
            <PiHeart size={25} />
            <span className="text-sm font-medium">{post.likesCount}</span>
          </div>
          <div
            className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-lg transition ease-in-out duration-300"
            data-no-nav
          >
            <PiHeartBreak size={25} />
            <span className="text-sm font-medium">{post.dislikesCount}</span>
          </div>
          <div
            className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-lg transition ease-in-out duration-300"
            data-no-nav
          >
            <PiChatCircle size={25} />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
