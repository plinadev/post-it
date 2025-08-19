import { useState } from "react";
import { CommentsSkeleton } from "../../components/CommentsSkeleton";
import { useCommentsForPost } from "../../hooks/comments/useCommentsForPost";
import { useCreateComment } from "../../hooks/comments/useCreateComment";
import { useAuthStore } from "../../state/user/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import type { Comment, Post } from "../../types";
import { useDeleteComment } from "../../hooks/comments/useDeleteComment";
import { useEditComment } from "../../hooks/comments/useEditComment";
import CommentItem from "./CommentItem";
import { buildCommentTree } from "../../utils/buildCommentTree";

function CommentsSection({ post }: { post: Post }) {
  const { postId } = useParams();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { comments, isFetching } = useCommentsForPost();
  const { deleteComment, isDeleting } = useDeleteComment();
  const { createComment, isCreating } = useCreateComment();
  const { editComment, isUpdating } = useEditComment();
  const [content, setContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  if (isFetching) return <CommentsSkeleton />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    console.log(content);
    createComment({ postId: postId!, content });
    setContent("");
  };

  const handleReplySubmit = (parentId: string, replyContent: string) => {
    console.log(parentId, replyContent);
    createComment({ postId: postId!, content: replyContent, parentId });
  };

  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleEditSave = (comment: Comment) => {
    if (editingContent.trim() === comment.content) {
      setEditingCommentId(null);
      setEditingContent("");
      return;
    }
    editComment(
      { commentId: comment.id, content: editingContent },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditingContent("");
        },
      }
    );
  };

  const handleDelete = (comment: Comment) =>
    deleteComment({ commentId: comment.id });

  const tree = comments ? buildCommentTree(comments.data) : [];
  return (
    <div className="bg-base-100 border border-base-200 rounded-lg">
      <div className="card-body flex flex-col gap-4">
        {/* Top-level comment form */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Reply to ${post.author.username}...`}
            className="input border-none flex-1"
            disabled={isCreating}
          />
          <button type="submit" className="btn" disabled={isCreating}>
            {isCreating ? "Posting..." : "Send"}
          </button>
        </form>

        {/* Comments tree */}
        {tree.length === 0 ? (
          <p className="text-sm text-stone-400">Be the first one to comment!</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {tree.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                user={user}
                navigate={navigate}
                onReply={setReplyingToId}
                onEditStart={handleEditStart}
                onDelete={handleDelete}
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
      </div>
    </div>
  );
}

export default CommentsSection;
