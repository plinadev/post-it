import {
  PiChatCircle,
  PiHeart,
  PiHeartBreak,
  PiHeartBreakDuotone,
  PiHeartBreakFill,
  PiHeartDuotone,
  PiHeartFill,
} from "react-icons/pi";
import type { Post } from "../types";
import { useLikePost } from "../hooks/reactions/useLikePost";
import { useDislikePost } from "../hooks/reactions/useDislikePost";
import { useRemoveReaction } from "../hooks/reactions/useRemoveReaction";
import { useNavigate } from "react-router-dom";

function Reactions({ post }: { post: Post }) {
  const navigate = useNavigate();
  const { likePost, isLiking } = useLikePost();
  const { dislikePost, isDisliking } = useDislikePost();
  const { removeReaction, isRemoving } = useRemoveReaction();
  const handleLikeClick = () => {
    likePost(post.id);
  };
  const handleDislikeClick = () => {
    dislikePost(post.id);
  };
  const handleRemoveReaction = () => {
    removeReaction(post.id);
  };
  const handleGoToPost = () => {
    navigate(`/post/${post.id}`);
  };
  return (
    <div className="flex items-center gap-3 pt-3 border-t border-base-200 text-stone-500">
      <div
        className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-lg transition ease-in-out duration-300"
        data-no-nav
      >
        {isLiking || isRemoving ? (
          <PiHeartDuotone size={25} className="animate-pulse" />
        ) : post.userReaction === "like" ? (
          <PiHeartFill size={25} onClick={handleRemoveReaction} />
        ) : (
          <PiHeart size={25} onClick={handleLikeClick} />
        )}

        <span className="text-sm font-medium">{post.likesCount}</span>
      </div>
      <div
        className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-lg transition ease-in-out duration-300"
        data-no-nav
      >
        {isDisliking || isRemoving ? (
          <PiHeartBreakDuotone size={25} className="animate-pulse" />
        ) : post.userReaction === "dislike" ? (
          <PiHeartBreakFill size={25} onClick={handleRemoveReaction} />
        ) : (
          <PiHeartBreak size={25} onClick={handleDislikeClick} />
        )}

        <span className="text-sm font-medium">{post.dislikesCount}</span>
      </div>
      <div
        className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-lg transition ease-in-out duration-300"
        data-no-nav
      >
        <PiChatCircle size={25} onClick={handleGoToPost} />
        <span className="text-sm font-medium">{post.commentsCount}</span>
      </div>
    </div>
  );
}

export default Reactions;
