// utils/homeworkStorage.ts

const STORAGE_KEY = "homeworkTokens";

type HomeworkTokenMap = {
  [slug: string]: string;
};

// Load all stored tokens from localStorage
export function loadHomeworkTokens(): HomeworkTokenMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (err) {
    console.error("Failed to load homework tokens from localStorage:", err);
    return {};
  }
}

// Save all tokens back to localStorage
export function saveHomeworkTokens(tokens: HomeworkTokenMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (err) {
    console.error("Failed to save homework tokens to localStorage:", err);
  }
}

// Get a specific token for a homework assignment (slug)
export function getHomeworkToken(slug: string): string | null {
  const tokens = loadHomeworkTokens();
  return tokens[slug] || null;
}

// Set or update a token for a homework assignment (slug)
export function setHomeworkToken(slug: string, token: string) {
  const tokens = loadHomeworkTokens();
  tokens[slug] = token;
  saveHomeworkTokens(tokens);
}

// Remove a token for a specific homework assignment (logout)
export function clearHomeworkToken(slug: string) {
  const tokens = loadHomeworkTokens();
  delete tokens[slug];
  saveHomeworkTokens(tokens);
}

// Completely clear all homework tokens (if needed)
export function clearAllHomeworkTokens() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear homework tokens from localStorage:", err);
  }
}
