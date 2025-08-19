import { useState } from "react";
import placeholder from "../../assets/placeholder.svg";
import { formatDate } from "../../utils/formatDate";
import { FaCheck, FaPen, FaTrash, FaX } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { PiChatCircle } from "react-icons/pi";
import type { Comment, User } from "../../types";

interface CommentItemProps {
  comment: Comment;
  user: User | null;
  navigate: (path: string) => void;
  onReply: (commentId: string) => void;
  onEditStart: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  editingCommentId: string | null;
  editingContent: string;
  setEditingContent: (content: string) => void;
  handleEditSave: (comment: Comment) => void;
  handleEditCancel: () => void;
  replyingToId: string | null;
  setReplyingToId: (commentId: string | null) => void;
  handleReplySubmit: (commentId: string, content: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isCreating: boolean;
}

function CommentItem({
  comment,
  user,
  navigate,
  onReply,
  onEditStart,
  onDelete,
  editingCommentId,
  editingContent,
  setEditingContent,
  handleEditSave,
  handleEditCancel,
  replyingToId,
  setReplyingToId,
  handleReplySubmit,
  isUpdating,
  isDeleting,
  isCreating,
}: CommentItemProps) {
  const [replyContent, setReplyContent] = useState("");

  return (
    <li className="pb-3 border-b border-base-200">
      <div className="flex justify-between gap-3">
        {/* Avatar */}
        <div className="flex items-center gap-3 w-full">
          <div className="avatar self-start flex flex-col gap-2 h-full">
            <div className="w-10 h-10 rounded-full">
              <img
                src={comment.author?.avatarUrl || placeholder}
                alt={comment.author?.username || "User avatar"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Comment content */}
          <div className="w-full">
            <div className="flex w-min gap-2 text-[14px] text-base-content/60">
              <p
                className="font-semibold text-base-content text-md cursor-pointer hover:underline "
                onClick={() => navigate(`/profile/${comment.userId}`)}
              >
                {comment.author?.username || "[deleted]"}
              </p>
              <span>{formatDate(comment.createdAt)}</span>
              {comment.edited && (
                <>
                  <span>•</span>
                  <span className="text-stone-300">Edited</span>
                </>
              )}
            </div>

            {/* Editing vs normal display */}
            {editingCommentId === comment.id ? (
              <div className="flex flex-col gap-2 items-center mt-1">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="textarea textarea-ghost w-full p-0 field-sizing-content text-justify resize-none text-[16px]"
                  disabled={isUpdating}
                />
                <div className="self-end flex gap-2">
                  <button
                    onClick={() => handleEditSave(comment)}
                    disabled={isUpdating}
                    className="btn btn-sm btn-ghost"
                  >
                    <FaCheck size={18} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    disabled={isUpdating}
                    className="btn btn-sm btn-ghost"
                  >
                    <FaX size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[16px] text-justify">{comment.content}</p>
            )}
          </div>
        </div>

        {/* Dropdown & reply */}
        <div className="flex flex-col">
          {comment.userId === user?.uid && (
            <div className="dropdown dropdown-right self-center" data-no-nav>
              <div
                tabIndex={0}
                role="button"
                className="bg-none w-min cursor-pointer text-stone-300"
              >
                <BsThreeDots size={20} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm"
              >
                <li>
                  <button
                    onClick={() => onEditStart(comment)}
                    disabled={isUpdating}
                  >
                    <FaPen /> Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onDelete(comment)}
                    disabled={isDeleting}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div
            className="flex items-center gap-2 p-1 cursor-pointer hover:bg-base-300 rounded-full transition ease-in-out duration-300"
            onClick={() => setReplyingToId(comment.id)}
          >
            <PiChatCircle size={22} className="text-stone-500" />
          </div>
        </div>
      </div>

      {/* Reply form */}
      {replyingToId === comment.id && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!replyContent.trim()) return;
            handleReplySubmit(comment.id, replyContent);
            setReplyContent("");
            setReplyingToId(null);
          }}
          className="ml-12 mt-2 flex gap-2"
        >
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`Reply to ${comment.author.username}...`}
            className="input border-none flex-1"
            disabled={isCreating}
          />
          <button type="submit" className="btn" disabled={isCreating}>
            {isCreating ? "Posting..." : "Send"}
          </button>
        </form>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <ul className="ml-10 mt-3 flex flex-col gap-3">
          {comment.replies.map((reply: Comment) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              user={user}
              navigate={navigate}
              onReply={onReply}
              onEditStart={onEditStart}
              onDelete={onDelete}
              editingCommentId={editingCommentId}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              handleReplySubmit={handleReplySubmit}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              isCreating={isCreating}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default CommentItem;
