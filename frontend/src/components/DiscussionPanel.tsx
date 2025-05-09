import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { apiFetch } from "@/utils/api";
import { getSessionId } from "@/utils/session";
import CommentItem from "./CommentItem";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useHomeworkContext } from "@/contexts/homeworkContext";

export type Comment = {
  id: number;
  text: string;
  name?: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at?: string | null;
  parent_id: number | null;
  agree_count: number;
  disagree_count: number;
  user_reaction?: "agree" | "disagree";
  children?: Comment[];
  session_id: string;
  edited?: boolean;
};

type DiscussionPanelProps = {
  title?: string;
  prompt?: string;
  placeholder?: string;
  commentSubmitLabel?: string;
  discussionSlug: string; // e.g. "trolley-vs-transplant"
};

function findCommentById(comments: Comment[], id: number): Comment | undefined {
  for (const c of comments) {
    if (c.id === id) return c;
    if (c.children) {
      const result = findCommentById(c.children, id);
      if (result) return result;
    }
  }
  return undefined;
}

function updateCommentTreeWithReaction(
  comments: Comment[],
  id: number,
  current: "agree" | "disagree" | undefined,
  next: "agree" | "disagree" | null
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === id) {
      let agree_count = comment.agree_count;
      let disagree_count = comment.disagree_count;

      if (current === "agree") agree_count--;
      if (current === "disagree") disagree_count--;

      if (next === "agree") agree_count++;
      if (next === "disagree") disagree_count++;

      return {
        ...comment,
        agree_count,
        disagree_count,
        user_reaction: next ?? undefined,
      };
    } else if (comment.children) {
      return {
        ...comment,
        children: updateCommentTreeWithReaction(comment.children, id, current, next),
      };
    }
    return comment;
  });
}

function replaceCommentById(comments: Comment[], updated: Comment): Comment[] {
  return comments.map((c) => {
    if (c.id === updated.id) {
      return { ...updated, children: c.children }; // preserve replies
    } else if (c.children) {
      return { ...c, children: replaceCommentById(c.children, updated) };
    } else {
      return c;
    }
  });
}


function removeCommentById(comments: Comment[], id: number): Comment[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, children: removeCommentById(c.children || [], id) }));
}


function nestComments(flatComments: Comment[]): Comment[] {
  const map: Record<number, Comment> = {};
  const roots: Comment[] = [];

  flatComments.forEach((c) => {
    map[c.id] = { ...c, children: [] };
  });

  flatComments.forEach((c) => {
    if (c.parent_id) {
      map[c.parent_id]?.children?.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}

export default function DiscussionPanel({
  title,
  prompt,
  placeholder = "Why do you think people feel differently about these situations?",
  commentSubmitLabel = "Submit Comment",
  discussionSlug
}: DiscussionPanelProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const sessionId = getSessionId();

  const { homeworkSession } = useHomeworkContext();

  const commentApiPath = `/comments/${discussionSlug}`;
  const replyApiPath = (parent_id: number) => `/comments/${discussionSlug}/reply/${parent_id}`;
  const reactApiPath = (id: number, reaction: "agree" | "disagree") => `/comments/${discussionSlug}/react/${id}/${reaction}`;

  useEffect(() => {
    apiFetch(commentApiPath)
      .then((res) => res.json())
      .then((data) => setComments(data.comments || []))
      .catch((err) => console.error("Failed to load comments", err));
  }, [commentApiPath]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await apiFetch(commentApiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: comment,
          session_id: sessionId,
          name: isAnonymous ? null : name || null,
          is_anonymous: isAnonymous,
          homework_participant_id: homeworkSession?.studentId ?? null,
        }),        
      });
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setComment("");
    } catch (err) {
      console.error("Failed to submit comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number, text: string) => {
    if (!text.trim()) return;
    try {
      const res = await apiFetch(replyApiPath(parentId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          session_id: sessionId,
          parent_id: parentId,
          name: isAnonymous ? null : name || null,
          is_anonymous: isAnonymous,
          homework_participant_id: homeworkSession?.studentId ?? null,
        }),
      });
      const reply = await res.json();
      setComments((prev) => [reply, ...prev]);
    } catch (err) {
      console.error("Failed to submit reply", err);
    }
  };

  const handleReact = async (commentId: number, reaction: "agree" | "disagree") => {
    const comment = findCommentById(comments, commentId);
    if (!comment) return;
  
    const current = comment.user_reaction;
  
    let newReaction: "agree" | "disagree" | null = reaction;
    if (current === reaction) {
      // Undo reaction
      newReaction = null;
    }
  
    // Hit backend
    await apiFetch(reactApiPath(commentId, reaction), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, toggle: true }), // optional: tell backend this may be a toggle
    });
  
    // Update state
    setComments((prev) =>
      updateCommentTreeWithReaction(prev, commentId, current, newReaction)
    );
  };
  
  const handleEdit = async (id: number, text: string) => {
    const comment = findCommentById(comments, id);
    if (!comment) return;
  
    const res = await apiFetch(`${commentApiPath}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        session_id: comment.session_id,  // required by backend schema
      }),
    });
  
    if (!res.ok) {
      console.error("Failed to update comment");
      return;
    }
  
    const updated = await res.json();
    setComments((prev) =>
      replaceCommentById(prev, {
        ...updated,
        user_reaction: findCommentById(prev, updated.id)?.user_reaction ?? null,
      })
    );
  };
  
  const handleDelete = async (id: number) => {
    await apiFetch(`${commentApiPath}/${id}`, { method: "DELETE" });
    setComments((prev) => removeCommentById(prev, id));
  };

  return (
      <div className="max-w-3xl w-full space-y-6">
        {title && (
          <h2 className="text-3xl font-semibold text-center">{title}</h2>
        )}
        {prompt && (
          <p className="text-lg text-center">{prompt}</p>
        )}

        <div className="space-y-2">
          <label htmlFor="userComment" className="block font-medium">
            (Optional) Share your thoughts:
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(!!checked)}
              />
              <Label htmlFor="anonymous" className="text-sm font-medium">
                Post anonymously
              </Label>
            </div>

            {!isAnonymous && (
              <div className="space-y-1">
                <Label htmlFor="name" className="block font-medium">
                  Your name:
                </Label>
                <input
                  id="name"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex"
                />
              </div>
            )}
          </div>

          <textarea
            id="userComment"
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-lg p-3 resize-none min-h-[100px]"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />

          {(!isAnonymous && !name.trim() && comment.trim()) && (
            <p className="text-red-500 text-sm">Please enter your name, or mark your comment as "Anonymous."</p>
          )}

          <Button onClick={handleSubmit} disabled={comment.trim().length === 0 || isSubmitting || (!isAnonymous && !name.trim())}>
            {isSubmitting ? "Submitting..." : commentSubmitLabel}
          </Button>
        </div>

        <div className="my-6">
          <h3 className="text-xl font-semibold mb-2">What others have said</h3>
          <div className="max-h-64 overflow-y-auto overflow-x-auto border border-gray-200 rounded-md p-4 space-y-4 bg-gray-50">
            {comments.length > 0 ? (
              nestComments(comments).map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReplySubmit={handleReply}
                  onReact={handleReact}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  depth={0}
                />
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to share!</p>
            )}
          </div>
        </div>

        {/* <p className="text-lg">Whenever you're ready, <b>scroll down</b> to continue.</p> */}
      </div>
  );
}
