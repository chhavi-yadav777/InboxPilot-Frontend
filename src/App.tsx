import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EmailProvider, useEmail } from "./context/EmailContext";
import { ChatProvider } from "./context/ChatContext";
import { Sidebar } from "./components/layout/Sidebar";
import { CentralStage } from "./components/chat/CentralStage";
import { ChatHistorySidebar } from "./components/chat/ChatHistorySidebar";
import { SourceInspectorModal } from "./components/email/SourceInspectorModal";
import { EmailExplorerModal } from "./components/email/EmailExplorerModal";
import { AuthCallback } from "./components/auth/AuthCallback";
import { LoginPage } from "./components/auth/LoginPage";
import { Sparkles, CheckCircle2, X, RefreshCw } from "lucide-react";

const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toastMessage, clearToast } = useEmail();
  const [isCallbackRoute, setIsCallbackRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.includes("/auth/callback") ||
      (window.location.search.includes("code=") && window.location.search.includes("state="))
    );
  });

  // 1. If currently in OAuth callback exchange route
  if (isCallbackRoute) {
    return (
      <AuthCallback
        onComplete={() => {
          setIsCallbackRoute(false);
          window.location.href = "/";
        }}
      />
    );
  }

  // 2. Loading state while checking session
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#f5f0e9] dark:bg-[#0c0d0e] p-4 text-center select-none">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#16171a] to-[#2a2c31] text-brand-500 shadow-xl flex items-center justify-center border border-stone-700">
            <Sparkles className="w-7 h-7 text-brand-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-stone-800 dark:text-stone-100">InboxPilot</p>
            <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center space-x-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-500" />
              <span>Checking authentication...</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. If unauthenticated, show Google Login screen first
  if (!user) {
    return <LoginPage />;
  }

  // 4. Authenticated: Render Full Dashboard
  return (
    <div className="w-screen h-screen flex bg-[#f5f0e9] dark:bg-[#0c0d0e] text-stone-800 dark:text-stone-200 overflow-hidden relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-4 right-1/2 translate-x-1/2 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl bg-stone-900 text-white text-xs shadow-2xl border border-stone-700 animate-slide-down">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={clearToast}
            className="w-4 h-4 rounded hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Column 1: Unified Left Sidebar */}
      <Sidebar />

      {/* Column 2: Main Central Stage (AI Canvas & Prompt Input) */}
      <CentralStage />

      {/* Column 3: Right Sidebar (Chat History) */}
      <ChatHistorySidebar />

      {/* Popovers & Modals */}
      <SourceInspectorModal />
      <EmailExplorerModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmailProvider>
          <ChatProvider>
            <MainLayout />
          </ChatProvider>
        </EmailProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
