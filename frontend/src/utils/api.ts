const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export function apiFetch(path: string, options?: RequestInit) {
  return fetch(`${baseUrl}${path}`, options);
}
