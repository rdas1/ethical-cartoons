const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export function apiFetch(path: string, options?: RequestInit) {
    console.log("API base URL:", baseUrl);
    return fetch(`${baseUrl}${path}`, options);
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
  