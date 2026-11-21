# InboxPilot Frontend

A modern, high-fidelity React frontend for **InboxPilot** — an AI-powered email intelligence platform that integrates Gmail ingestion, MongoDB persistence, Pinecone vector search, and Gemini conversational RAG.

---

## 🚀 Overview

InboxPilot provides an elegant multi-pane interface inspired by modern AI workspaces:

- **Unified Left Sidebar**: Clean branding, "New Chat" action (`⌘N`), conversation search (`⌘K`), navigation links (Canvas, Mailbox Explorer, Sync Gmail Inbox), reasoning modes (`Think Longer`, `Deep Research`), and user account bar with one-click Log Out.
- **Central Stage**:
  - **Hero State**: Glowing orbital emblem, quick suggestion chips (`Help me write`, `Summarize today's emails`, `Find interview details`, `Analyze receipts & costs`).
  - **Active Conversation**: Grounded Markdown responses with **interactive citation badges (`[1]`, `[2]`)**. Clicking a citation opens the **Source Inspector** to view matching emails, dates, sender metadata, and vector relevance scores.
  - **Floating Prompt Bar**: Auto-expanding input, `Think Longer` mode (dynamically scales search depth `top_k`), voice input, and status alert banner.
- **Chat History Sidebar**: Date-grouped conversations (`Today`, `Yesterday`) with instant session restoration.
- **Email Explorer**: Dedicated mailbox browser to search records and trigger incremental or full Gmail mailbox synchronization.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown & Citations**: `react-markdown` + `remark-gfm` with custom interactive badge parsing
- **HTTP / Auth**: Browser `fetch` with HTTP-only session cookie tracking (`credentials: "include"`)

---

## ⚙️ Configuration & Environment

Set the API base URL in the frontend environment (`.env`):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Configure the matching backend `.env` values:

```env
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
FRONTEND_URL=http://127.0.0.1:5173/
```

> [!IMPORTANT]
> - Add `http://127.0.0.1:8000/auth/google/callback` to the authorized redirect URIs in the Google Cloud Console for the OAuth web client.
> - Maintain consistency with the `127.0.0.1` (or `localhost`) hostname across frontend and API to ensure session cookies are preserved seamlessly.

---

## 🔑 Authentication Flow (Google OAuth 2.0 + HTTP-Only Session Cookie)

The frontend integrates directly with the backend flow specified in [`readme-frontend.md`](./readme-frontend.md):

1. **Initiate Sign-In**:
   - The user clicks **Continue with Google** on the Login screen.
   - The frontend calls `GET /auth/google` with `{ credentials: "include" }`.
   - The backend stores state & PKCE verifier cookies (HTTP-only) and returns `{ authorization_url }`.
   - The browser navigates to Google's consent screen.

2. **Backend Callback & Direct 303 Redirect**:
   - Google redirects directly to `GOOGLE_REDIRECT_URI` (`http://127.0.0.1:8000/auth/google/callback`).
   - The backend validates the PKCE verifier and state cookies on its own domain, exchanges the code with Google, and stores user credentials in MongoDB.
   - The backend sets the HTTP-only session cookie (`inboxpilot_session`) and sends a `303 See Other` redirect to `FRONTEND_URL` (`http://127.0.0.1:5173/`).

3. **Session Hydration (`GET /users/me`)**:
   - The browser arrives at the frontend already holding the valid session cookie.
   - The frontend issues `GET /users/me` with `credentials: "include"`.
   - If authenticated, the user profile is returned and the full 4-pane dashboard is displayed.
   - If the session expires or is missing (`401`), the Login screen is shown.

4. **Sign Out (`POST /auth/logout`)**:
   - Clicking **Log Out** in the top header, navigation rail, or account bar sends `POST /auth/logout` with `credentials: "include"`.
   - The backend clears the session cookie and returns `204`.
   - The frontend resets user state and returns to the Login screen.

---

## 📡 API Endpoints Used

All browser API calls use `credentials: "include"`:

| Method and path | Purpose | Auth |
|---|---|---|
| `GET /auth/google` | Starts OAuth flow with cookie credentials and PKCE challenge | None |
| `GET /users/me` | Current profile and email sync checkpoint | Session cookie or bearer token |
| `POST /auth/logout` | Clear the browser session cookie | Session cookie |
| `POST /emails/fetch` | Fetch the complete available Gmail mailbox, save it, and index it | Session cookie or bearer token |
| `POST /emails/sync` | Fetch messages after the saved checkpoint | Session cookie or bearer token |
| `POST /emails/index` | Re-index stored MongoDB email records in Pinecone | Session cookie or bearer token |
| `GET /emails?limit=50&offset=0` | Page through stored email records (limit 1–100) | Session cookie or bearer token |
| `POST /chat` | RAG email chat question with `top_k` and `conversation_id` | Session cookie or bearer token |
| `GET /chats?limit=20` | List recent conversation sessions | Session cookie or bearer token |
| `GET /chats/{conversation_id}` | Read saved turns and their cited email sources | Session cookie or bearer token |
| `GET /health` | Backend dependency health check | None |

---

## 💻 Getting Started

### 1. Install Dependencies

```powershell
npm install
```

### 2. Start the Development Server

```powershell
npm run dev
```

The application will be accessible at:
👉 **`http://127.0.0.1:5173`** (or `http://localhost:5173`)

### 3. Production Build & Preview

```powershell
# Type check and build
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
InboxPilot-Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthCallback.tsx      # Fallback callback handler
│   │   │   └── LoginPage.tsx         # Google sign-in gate & feature highlights
│   │   ├── chat/
│   │   │   ├── CentralStage.tsx      # Hero, Markdown chat turns, [1] citations, input bar
│   │   │   └── ChatHistorySidebar.tsx# Grouped conversation history (Today/Yesterday)
│   │   ├── email/
│   │   │   ├── EmailExplorerModal.tsx# Mailbox viewer with sync & reindex actions
│   │   │   └── SourceInspectorModal.tsx # Citation evidence modal with relevance score
│   │   └── layout/
│   │       └── Sidebar.tsx           # Unified left sidebar with search, modes, and logout
│   ├── context/
│   │   ├── AuthContext.tsx           # Authentication state, login, and logout
│   │   ├── ChatContext.tsx           # Active session, streaming turns, and top_k depth
│   │   └── EmailContext.tsx          # Mailbox sync status, toast alerts, and modal triggers
│   ├── services/
│   │   └── api.ts                    # Backend API client matching readme-frontend.md
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces for API models
│   ├── App.tsx                       # Root layout & route switcher
│   ├── index.css                     # Custom fonts, scrollbars, and glassmorphism
│   ├── main.tsx                      # Application entry point
│   └── vite-env.d.ts                 # Vite environment definitions
├── .env                              # Environment configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
