import { useState } from "react";
import { Button } from "./ui/button";
import type { Comment } from "./DiscussionPanel";

export default function CommentItem({
    comment,
    onReplySubmit,
    onReact,
    depth = 0,
  }: {
    comment: Comment;
    onReplySubmit: (parentId: number, text: string) => void;
    onReact: (id: number, reaction: "agree" | "disagree") => void;
    depth?: number;
  }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className={`mb-4 ml-${depth * 4} border-l pl-4`}>
      <div className="bg-white p-3 rounded shadow-sm">
        <p>{comment.text}</p>
        <div className="flex items-center gap-3 text-sm mt-2 text-gray-500">
            <button onClick={() => setShowReplyBox(!showReplyBox)} className="hover:underline">Reply</button>
            <button onClick={() => onReact(comment.id, "agree")}>
                {comment.user_reaction === "agree" ? `You agreed (${comment.agree_count})` : `Agree (${comment.agree_count})`}
            </button>
            <button onClick={() => onReact(comment.id, "disagree")}>
                {comment.user_reaction === "disagree" ? `You disagreed (${comment.disagree_count})` : `Disagree (${comment.disagree_count})`}
            </button>
        </div>
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
        />
        ))}
    </div>
  );
}
