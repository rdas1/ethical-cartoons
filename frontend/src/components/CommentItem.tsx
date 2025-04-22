import { useState } from "react";
import { Button } from "./ui/button";
import { getSessionId } from "@/utils/session";
import type { Comment } from "./DiscussionPanel";

export default function CommentItem({
  comment,
  onReplySubmit,
  onReact,
  onEdit,
  onDelete,
  depth = 0,
}: {
  comment: Comment;
  onReplySubmit: (parentId: number, text: string) => void;
  onReact: (id: number, reaction: "agree" | "disagree") => void;
  onEdit?: (id: number, text: string) => void;
  onDelete?: (id: number) => void;
  depth?: number;
}) {
  const sessionId = getSessionId();
  const isAuthor = comment.session_id === sessionId;

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  return (
    <div style={{ marginLeft: depth * 16 }} className="mb-4 border-l pl-4">
      <div className="bg-white p-3 rounded shadow-sm">
        {isEditing ? (
          <>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <Button
              className="mt-1"
              onClick={() => {
                onEdit?.(comment.id, editText);
                setIsEditing(false);
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <p>
              {comment.text}
              {comment.edited && (
                <span className="text-xs text-gray-400 ml-2">(edited)</span>
              )}
            </p>
            <div className="flex items-center gap-3 text-sm mt-2 text-gray-500">
                <button
                    onClick={() => setShowReplyBox(!showReplyBox)}
                    className="hover:underline"
                >
                    Reply
                </button>

                <button onClick={() => onReact(comment.id, "agree")} className="hover:underline">
                    {comment.user_reaction === "agree"
                        ? `You agreed (${comment.agree_count})`
                        : `Agree (${comment.agree_count})`}
                </button>
                <button onClick={() => onReact(comment.id, "disagree")} className="hover:underline">
                    {comment.user_reaction === "disagree"
                        ? `You disagreed (${comment.disagree_count})`
                        : `Disagree (${comment.disagree_count})`}
                </button>

              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(comment.id)}
                    className="hover:underline text-gray-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {showReplyBox && (
        <div className="mt-2">
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button
            className="mt-1"
            onClick={() => {
              onReplySubmit(comment.id, replyText);
              setReplyText("");
              setShowReplyBox(false);
            }}
          >
            Submit Reply
          </Button>
        </div>
      )}

      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          onReplySubmit={onReplySubmit}
          onReact={onReact}
          onEdit={onEdit}
          onDelete={onDelete}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
