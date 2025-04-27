import { useHomeworkContext } from "@/contexts/homeworkContext";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export function apiFetch(path: string, options?: RequestInit) {
    const headers = options?.headers ? new Headers(options.headers) : new Headers();
    if (options?.method === "POST" || options?.method === "PUT") {
        headers.set("Content-Type", "application/json");
      }
      return fetch(`${baseUrl}${path}`, {
        ...options,
        headers,
      });
}

export async function submitResponse({
    scenario,
    decision,
    sessionId,
    homeworkParticipantId,
  }: {
    scenario: string;
    decision: string;
    sessionId: string;
    homeworkParticipantId?: number | null;  // optional
  }) {
    const body: any = {
      scenario,
      decision,
      session_id: sessionId,
    };
  
    if (homeworkParticipantId) {
      body.homework_participant_id = homeworkParticipantId;
    }
  
    return await apiFetch("/submit", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

export async function fetchComments(scenario: string) {
    const res = await apiFetch(`/comments/${scenario}`);
    return res.json();
}
  
export async function postComment(scenario: string, comment: string, sessionId: string) {
    const res = await apiFetch(`/comments/${scenario}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment, session_id: sessionId }),
    });
    return res.json();
}
  