import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { apiFetch } from "@/utils/api";
import { getSessionId } from "@/utils/session";

type Comment = {
  id: number;
  text: string;
  created_at: string;
};

type DiscussionPanelProps = {
  title: string;
  prompt: string;
  commentPrompt?: string;
  commentSubmitLabel?: string;
  commentApiPath: string; // e.g. "/comments/trolley-vs-transplant"
  onContinue?: () => void;
};

export default function DiscussionPanel({
  title,
  prompt,
  commentPrompt = "Why do you think people feel differently about these situations?",
  commentSubmitLabel = "Submit Comment",
  commentApiPath,
  onContinue,
}: DiscussionPanelProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionId = getSessionId();

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
        body: JSON.stringify({ text: comment, session_id: sessionId }),
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

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center scroll-snap-start bg-white p-6 text-black">
      <div className="max-w-3xl w-full space-y-6">
        <h2 className="text-3xl font-semibold text-center">{title}</h2>
        <p className="text-lg text-center">{prompt}</p>

        <div className="space-y-2">
          <label htmlFor="userComment" className="block font-medium">
            (Optional) Share your thoughts:
          </label>
          <textarea
            id="userComment"
            placeholder={commentPrompt}
            className="w-full border border-gray-300 rounded-lg p-3 resize-none min-h-[100px]"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <Button onClick={handleSubmit} disabled={comment.trim().length === 0 || isSubmitting}>
            {isSubmitting ? "Submitting..." : commentSubmitLabel}
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">What others have said</h3>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 space-y-4 bg-gray-50">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="p-3 bg-white rounded shadow-sm">
                  {c.text}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to share!</p>
            )}
          </div>
        </div>

        {onContinue && (
          <div className="text-center mt-8">
            <Button onClick={onContinue}>Continue to Interpretation</Button>
          </div>
        )}
      </div>
    </section>
  );
}
