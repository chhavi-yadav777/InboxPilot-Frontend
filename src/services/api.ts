import {
  EmailListResponse,
  ChatTurn,
  ChatSession,
  IngestionStatus,
  User,
  HealthStatus,
} from "../types";

const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
export const API_BASE = rawBase ? rawBase.replace(/\/+$/, "") : "http://127.0.0.1:8000";

export const TOKEN_STORAGE_KEY = "inboxpilot_access_token";

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

/**
 * Standard fetch helper with credentials: "include" for HTTP-only session cookies
 */
export async function apiFetch<T>(
  path: string,
  token?: string | null,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  const effectiveToken = token || getStoredToken();
  if (effectiveToken) {
    headers.set("Authorization", `Bearer ${effectiveToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(errorBody.detail ?? `Request failed (${response.status})`);
  }

  return response.json();
}

/**
 * Initiates Google OAuth sign-in flow by requesting authorization URL
 */
export async function startGoogleSignIn(): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/google`, {
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Could not start Google sign-in" }));
    throw new Error(err.detail || "Could not start Google sign-in");
  }
  const { authorization_url } = await response.json();
  window.location.assign(authorization_url);
}

/**
 * Load signed-in user profile from GET /users/me using HTTP-only session cookie
 */
export async function loadCurrentUser(): Promise<User | null> {
  try {
    const headers = new Headers({ "Content-Type": "application/json" });
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}/users/me`, {
      credentials: "include",
      headers,
    });

    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (err) {
    return null;
  }
}

/**
 * Sign out by clearing backend session cookie (POST /auth/logout)
 */
export async function signOut(): Promise<void> {
  setStoredToken(null);
  try {
    sessionStorage.clear();
    localStorage.clear();
  } catch {}
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.warn("Sign-out request error:", err);
  }
}

/**
 * Check backend health status (GET /health)
 */
export async function checkBackendHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (res.ok) {
      return { status: "ok" };
    }
    return { status: "unavailable" };
  } catch (err: any) {
    return { status: "unavailable", error: err.message };
  }
}

/**
 * Fetch current authenticated user profile
 */
export async function fetchCurrentUser(token?: string | null): Promise<User> {
  const user = await loadCurrentUser();
  if (user) return user;
  if (token) {
    return apiFetch<User>("/users/me", token);
  }
  throw new Error("User not authenticated");
}

/**
 * Run full mailbox ingestion (POST /emails/fetch)
 */
export async function fetchAllEmails(token?: string | null): Promise<IngestionStatus> {
  return apiFetch<IngestionStatus>("/emails/fetch", token, { method: "POST" });
}

/**
 * Run incremental mailbox sync (POST /emails/sync)
 */
export async function syncEmails(token?: string | null): Promise<IngestionStatus> {
  return apiFetch<IngestionStatus>("/emails/sync", token, { method: "POST" });
}

/**
 * Re-index stored emails in Pinecone (POST /emails/index)
 */
export async function reindexStoredEmails(token?: string | null): Promise<{ indexed: number }> {
  return apiFetch<{ indexed: number }>("/emails/index", token, { method: "POST" });
}

/**
 * List paginated emails (GET /emails)
 */
export async function listEmails(
  token?: string | null,
  limit: number = 50,
  offset: number = 0
): Promise<EmailListResponse> {
  return apiFetch<EmailListResponse>(`/emails?limit=${limit}&offset=${offset}`, token);
}

/**
 * Send a chat question and get grounded RAG answer (POST /chat)
 */
export async function sendChatMessage(
  token: string | null,
  question: string,
  topK: number = 5,
  conversationId?: string | null
): Promise<{ conversation_id: string; answer: string; sources: any[] }> {
  return apiFetch<{ conversation_id: string; answer: string; sources: any[] }>("/chat", token, {
    method: "POST",
    body: JSON.stringify({
      question,
      top_k: topK,
      conversation_id: conversationId || undefined,
    }),
  });
}

/**
 * List recent chat conversations (GET /chats)
 */
export async function listChatConversations(
  token?: string | null,
  limit: number = 20
): Promise<ChatSession[]> {
  const data = await apiFetch<{ items: ChatSession[]; limit: number }>(`/chats?limit=${limit}`, token);
  return data.items || [];
}

/**
 * Get turns of a specific conversation (GET /chats/{conversation_id})
 */
export async function getChatHistory(
  token: string | null,
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ conversation_id: string; items: ChatTurn[]; limit: number; offset: number }> {
  return apiFetch<{ conversation_id: string; items: ChatTurn[]; limit: number; offset: number }>(
    `/chats/${conversationId}?limit=${limit}&offset=${offset}`,
    token
  );
}

export async function finishGoogleSignIn(): Promise<{ user: User }> {
  const user = await loadCurrentUser();
  if (user) {
    return { user };
  }
  throw new Error("Google sign-in did not complete");
}
