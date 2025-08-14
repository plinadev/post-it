import { PiChatCircle, PiHeart, PiHeartBreak } from "react-icons/pi";
import placeholder from "../assets/placeholder.svg";
import type { Post } from "../types";
import { formatDate } from "../utils/formatDate";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
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
};
export const PostCard = ({ post, author, byMe }: PostCardProps) => {
  const { deletePost, isDeleting } = useDeletePost();
  const handleDeletePost = async () => {
    deletePost(post.id);
  };
  return (
    <div className="card bg-base-100  hover:shadow-xl transition-all duration-300 border border-base-200 hover:border-base-300">
      <div className="card-body">
        {/* Post Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-15 h-15 rounded-full">
                <img
                  src={author?.avatarUrl || placeholder}
                  alt={author?.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="font-semibold text-base-content text-lg">
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
            <div className="dropdown  dropdown-right self-start">
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
              alt="Post image"
              className="w-full h-64 object-cover rounded-lg border border-base-300"
            />
          </figure>
        )}

        {/* Post Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-base-200 text-stone-500">
          <div className="flex items-center gap-2">
            <PiHeart size={25} />
            <span className="text-sm font-medium">{post.likesCount}</span>
          </div>
          <div className="flex items-center gap-2 ">
            <PiHeartBreak size={25} />
            <span className="text-sm font-medium">{post.dislikesCount}</span>
          </div>
          <div className="flex items-center gap-2 ">
            <PiChatCircle size={25} />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
