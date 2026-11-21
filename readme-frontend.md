# InboxPilot Frontend Integration

This guide describes how a browser frontend can use the InboxPilot FastAPI backend. The examples use plain TypeScript and `fetch`; they work with React, Vue, Svelte, or another browser framework.

## Configuration

Set the API base URL in the frontend environment. For Vite, for example:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Configure the backend `.env` values for the API callback and frontend landing page:

```env
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
FRONTEND_URL=http://127.0.0.1:5173/
```

Add the exact `GOOGLE_REDIRECT_URI` value to the authorized redirect URIs for the Google OAuth web client. Keep the `127.0.0.1` hostname consistent for the frontend, API, and callback during local development. The API accepts CORS requests from any HTTP or HTTPS origin and allows credentialed requests. For production OAuth, use HTTPS and keep the frontend and API on the same site (for example, `app.example.com` and `api.example.com`) so browser cookie rules allow the session cookie to be sent.

Start the API from the repository root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn API.index:app --host 0.0.0.0 --port 8000
```

The OpenAPI UI is at `http://localhost:8000/docs`.

## Google Sign-In

Google redirects to the backend callback. The backend validates its HTTP-only state and PKCE verifier cookies, exchanges the code, saves the Google profile and credentials, sets an HTTP-only session cookie, and redirects the browser to `FRONTEND_URL`. `/auth/google` creates the PKCE challenge and stores the matching verifier in a short-lived, HTTP-only cookie. The frontend must preserve cookies but must never read or send the verifier or session cookie itself.

1. Call `/auth/google` with browser credentials enabled. This sets the state and PKCE verifier cookies and returns an authorization URL. Include `credentials: "include"` so the browser keeps the cookies.
2. Navigate the browser to that URL.
3. Google redirects to `GOOGLE_REDIRECT_URI` on the backend.
4. The backend exchanges the code once, sets the session cookie, and sends a `303` redirect to `FRONTEND_URL`.
5. The frontend loads the signed-in profile by calling `GET /users/me` with `credentials: "include"`.

```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function startGoogleSignIn() {
  const response = await fetch(`${API_BASE}/auth/google`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Could not start Google sign-in");
  const { authorization_url } = await response.json();
  window.location.assign(authorization_url);
}

export async function loadCurrentUser() {
  const response = await fetch(`${API_BASE}/users/me`, {
    credentials: "include",
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Could not load the signed-in user");
  return response.json();
}
```

After successful sign-in, the browser lands at `http://127.0.0.1:5173/`. The JWT is in an HTTP-only cookie, not in the URL or JavaScript response. Load the profile with `/users/me`:

```json
{
  "id": "<database-id>",
  "google_sub": "<google-user-id>",
  "email": "user@gmail.com",
  "name": "User Name",
  "picture": "https://...",
  "checkpoint_timestamp": null,
  "created_at": "2026-11-13T00:00:00Z",
  "updated_at": "2026-11-13T00:00:00Z"
}
```

The session cookie expires according to `ACCESS_TOKEN_EXPIRE_MINUTES` (60 minutes by default). The frontend cannot read the JWT; use `/users/me` to restore the user's UI state. A `401` means ask the user to sign in again.

Google authorization codes are short-lived and single-use. If callback exchange returns `invalid_grant`, do not retry the same callback URL: start sign-in again from `/auth/google` and let the new callback complete once. If it keeps happening on a fresh attempt, compare the decoded `client_id` and `redirect_uri` in the newly returned authorization URL with the Google OAuth client configuration. Never paste a full callback URL into logs or support messages because it contains the authorization code.

## Authenticated API Requests

Browser API calls use the HTTP-only cookie and must set `credentials: "include"`. API clients outside the browser may continue using `Authorization: Bearer <access_token>`.

```ts
export async function apiFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (response.status === 204) return undefined;
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail ?? `Request failed (${response.status})`);
  }
  return response.json();
}

export async function signOut() {
  await apiFetch("/auth/logout", { method: "POST" });
  window.location.assign("/");
}
```

## Endpoints

| Method and path | Purpose | Auth |
| --- | --- | --- |
| `GET /users/me` | Current profile and email sync checkpoint. | Session cookie or bearer token |
| `POST /auth/logout` | Clear the browser session cookie. | Session cookie |
| `POST /emails/fetch` | Fetch the complete available Gmail mailbox, save it, and index it. This request stays open until processing finishes. | Session cookie or bearer token |
| `POST /emails/sync` | Fetch messages after the saved checkpoint; does an initial full fetch when no checkpoint exists. | Session cookie or bearer token |
| `POST /emails/index` | Re-index stored MongoDB email records in Pinecone. | Session cookie or bearer token |
| `GET /emails?limit=50&offset=0` | Page through the current user's email records. `limit` is 1–100. | Session cookie or bearer token |
| `POST /chat` | Retrieve top matching emails, generate an answer with Gemini, and save the turn. | Session cookie or bearer token |
| `GET /chats?limit=20` | List recent conversations. `limit` is 1–100. | Session cookie or bearer token |
| `GET /chats/{conversation_id}?limit=50&offset=0` | Read saved turns and their cited sources. | Session cookie or bearer token |
| `GET /health` | Backend dependency health. | None |

### Fetch, Sync, and Email Listing

Fetch and sync endpoints have no request body. Their response looks like:

```json
{
  "fetched": 12,
  "stored": 12,
  "indexed": 12,
  "checkpoint_timestamp": "2026-11-04T12:30:00Z"
}
```

The email list response contains `items`, `limit`, `offset`, and `total`. Each email item has `email_id`, `thread_id`, `subject`, `sender`, `receiver`, `date` (`YYYY-MM-DD`), and `body`.

### Email Chat

Send a question and optionally choose a result count (`top_k` defaults to 5 and must be 1–20):

```http
POST /chat
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "question": "When is my interview and who scheduled it?",
  "top_k": 5
}
```

Example response:

```json
{
  "conversation_id": "2e28e24b-5f90-460c-b672-9b35ee2d1718",
  "answer": "Your interview is scheduled for Monday [1]. It was sent by hr@company.com [1].",
  "sources": [
    {
      "source_id": "[1]",
      "email_id": "18abc123",
      "thread_id": "thread123",
      "subject": "Interview Schedule",
      "sender": "hr@company.com",
      "receiver": "user@gmail.com",
      "date": "2026-11-04",
      "score": 0.87,
      "snippet": "Your interview is scheduled for Monday..."
    }
  ]
}
```

Pass the returned `conversation_id` on the next request to continue that conversation:

```json
{
  "question": "What time does the email say?",
  "conversation_id": "2e28e24b-5f90-460c-b672-9b35ee2d1718",
  "top_k": 5
}
```

The answer is grounded in the returned source markers (for example, `[1]`). Store the conversation ID in frontend state and use `GET /chats/{conversation_id}` to reload its saved turns.

## Error Handling

- `401`: missing, invalid, or expired session; sign in again.
- `400`: OAuth state or PKCE verifier cookie is missing/mismatched, or Google sign-in was cancelled; restart sign-in from `/auth/google` in the same browser.
- `422`: invalid request fields, such as a blank question or `top_k` outside 1–20.
- `502`: Gmail, Pinecone, or Gemini processing failed; show a retry option. For failed email sync, the checkpoint is not advanced.
- `503`: backend dependency or configuration is unavailable; check `/health` and retry later.

For a callback `502` with `invalid_grant`, start a new OAuth flow rather than retrying the old callback. A PKCE verifier cookie is created with each `/auth/google` request; a callback from an earlier attempt cannot use a newer attempt's verifier. The callback itself now redirects to `FRONTEND_URL` on success and stores the JWT in an HTTP-only cookie.

The backend only returns the authenticated user's emails and chat history. Chat requests send the retrieved email evidence to Gemini to generate the answer.
