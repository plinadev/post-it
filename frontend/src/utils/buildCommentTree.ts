import type { Comment } from "../types";

export function buildCommentTree(comments: Comment[]) {
  type CommentNode = Comment & { replies: CommentNode[] };

  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  // create nodes with empty replies array
  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  // attach children to parents
  comments.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parentId) {
      const parent = map.get(c.parentId);
      if (parent) parent.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  // helper to convert Firestore timestamp to milliseconds
  const toMillis = (createdAt: any) => {
    if (!createdAt) return 0;
    if (typeof createdAt.toMillis === "function") return createdAt.toMillis();
    if (createdAt._seconds)
      return createdAt._seconds * 1000 + createdAt._nanoseconds / 1e6;
    return 0;
  };

  // only sort replies recursively
  const sortReplies = (nodes: CommentNode[]) => {
    nodes.forEach((n) => {
      if (n.replies.length > 0) {
        n.replies.sort((a, b) => toMillis(a.createdAt) - toMillis(b.createdAt));
        sortReplies(n.replies); // sort nested replies
      }
    });
  };

  sortReplies(roots);

  return roots;
}
