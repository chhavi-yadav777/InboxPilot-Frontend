import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MoreHorizontal,
  Sun,
  Moon,
  Info,
  Bell,
  Plus,
  Mic,
  ArrowUp,
  ExternalLink,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useEmail } from "../../context/EmailContext";
import { useTheme } from "../../context/ThemeContext";
import { EmailSource } from "../../types";

export const CentralStage: React.FC = () => {
  const {
    activeConversationId,
    turns,
    isGenerating,
    thinkLonger,
    setThinkLonger,
    sendMessage,
    startNewChat,
  } = useChat();

  const { theme, toggleTheme } = useTheme();
  const { user, backendHealth, loginWithGoogle, logout } = useAuth();
  const { setSelectedSource, triggerSync, isSyncing, totalEmails } = useEmail();

  const [inputQuestion, setInputQuestion] = useState("");
  const [copiedTurnIndex, setCopiedTurnIndex] = useState<number | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new turns
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, isGenerating]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuestion.trim() || isGenerating) return;
    const q = inputQuestion;
    setInputQuestion("");
    sendMessage(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTurnIndex(index);
    setTimeout(() => setCopiedTurnIndex(null), 2000);
  };

  const promptSuggestions = [
    { label: "Help me write", query: "Help me write a concise follow-up email regarding our project milestone" },
    { label: "Summarize today's emails", query: "Summarize the key emails and announcements received recently" },
    { label: "Find interview details", query: "When is my upcoming interview and who is scheduled to attend?" },
    { label: "Analyze receipts & costs", query: "What recent invoices and payment receipts were received?" },
  ];

  // Helper to parse citations like [1] or [2] in markdown and render interactive buttons
  const renderFormattedAnswer = (answer: string, sources: EmailSource[]) => {
    // Replace citation tags [1], [2] with a custom markdown link or pattern
    return (
      <div className="prose prose-stone dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 text-[14px] leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => {
              // Intercept string tokens to replace [n] with clickable badges
              const processed = React.Children.map(children, (child) => {
                if (typeof child === "string") {
                  const parts = child.split(/(\[\d+\])/g);
                  return parts.map((part, i) => {
                    const match = part.match(/\[(\d+)\]/);
                    if (match) {
                      const sourceIndex = match[0];
                      const matchedSource = sources.find((s) => s.source_id === sourceIndex);
                      return (
                        <button
                          key={i}
                          onClick={() => matchedSource && setSelectedSource(matchedSource)}
                          className="inline-flex items-center justify-center px-1.5 py-0.2 mx-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-100/90 dark:bg-brand-950/60 hover:bg-brand-200 dark:hover:bg-brand-900/80 rounded-md border border-brand-300 dark:border-brand-700 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                          title={matchedSource ? `Email: "${matchedSource.subject}" by ${matchedSource.sender} (${matchedSource.date})` : "View Source"}
                        >
                          {sourceIndex}
                        </button>
                      );
                    }
                    return part;
                  });
                }
                return child;
              });
              return <p className="mb-3 last:mb-0">{processed}</p>;
            },
          }}
        >
          {answer}
        </ReactMarkdown>
      </div>
    );
  };

  const hasTurns = turns.length > 0;

  return (
    <div className="flex-1 h-full flex flex-col justify-between p-3.5 select-none relative overflow-hidden">
      {/* Outer Card with Warm/Dark Backdrop matching mockup */}
      <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#fdfbf9] via-[#faf7f0] to-[#f6f2e9] dark:from-[#18191d] dark:via-[#141518] dark:to-[#111215] border border-stone-200/80 dark:border-stone-800 shadow-card-warm dark:shadow-2xl flex flex-col justify-between overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="px-5 py-3.5 border-b border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between shrink-0 bg-white/40 dark:bg-[#18191d]/60 backdrop-blur-md z-20">
          {/* Left: Model Selector & Actions */}
          <div className="flex items-center space-x-3">
            {/* InboxPilot Brand Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#202227] border border-stone-200 dark:border-stone-700/80 text-stone-800 dark:text-stone-200 text-xs font-semibold shadow-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>InboxPilot</span>
            </div>

            <button
              onClick={startNewChat}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-brand-500/25 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Right: Controls & Profile */}
          <div className="flex items-center space-x-2.5">
            {/* Dark Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-white/80 dark:hover:bg-stone-800 transition-all"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Sync trigger button */}
            <button
              onClick={() => triggerSync()}
              disabled={isSyncing}
              className="p-1.5 rounded-xl text-stone-500 hover:text-brand-600 dark:text-stone-400 dark:hover:text-brand-400 hover:bg-white/80 dark:hover:bg-stone-800 transition-all"
              title="Sync Gmail Mailbox"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-brand-500" : ""}`} />
            </button>

            {/* Backend Info / Health Indicator */}
            <div
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-white/80 dark:hover:bg-stone-800 transition-all cursor-pointer relative group"
              title={`API Health: ${backendHealth.status}`}
            >
              <Info className="w-4 h-4" />
              <span
                className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  backendHealth.status === "ok" ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => alert(`Mailbox is indexed with ${totalEmails} messages.`)}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-white/80 dark:hover:bg-stone-800 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
            </button>

            {/* User Profile Avatar & Sign Out */}
            {user ? (
              <div className="flex items-center space-x-2 pl-1 relative">
                {/* Dedicated Log Out Button */}
                <button
                  onClick={() => logout()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-stone-700 hover:text-red-600 border border-stone-200 hover:border-red-200 dark:bg-[#202227] dark:hover:bg-red-950/40 dark:text-stone-300 dark:hover:text-red-400 dark:border-stone-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
                  title="Sign out of InboxPilot"
                >
                  <LogOut className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 hover:text-red-600" />
                  <span>Log Out</span>
                </button>

                {/* Avatar with Dropdown */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 focus:outline-none"
                  title={`${user.name} (${user.email})`}
                >
                  <img
                    src={user.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-brand-400 object-cover shadow-xs"
                  />
                </button>

                {/* Profile Popup Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-11 w-64 rounded-2xl bg-white dark:bg-[#1c1e22] border border-stone-200 dark:border-stone-700 shadow-2xl p-3 z-50 animate-fade-in text-left">
                    <div className="flex items-center space-x-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <img
                        src={user.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-brand-400 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="py-2 space-y-1 text-xs">
                      <div className="flex items-center justify-between py-1 text-stone-500 dark:text-stone-400 text-[11px]">
                        <span>Authentication</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Google OAuth 2.0</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-stone-500 dark:text-stone-400 text-[11px]">
                        <span>Backend API</span>
                        <span className="font-mono text-[10px] text-stone-700 dark:text-stone-300">127.0.0.1:8000</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Center Canvas: Hero or Active Conversation */}
        <div className="flex-1 overflow-y-auto px-5 md:px-12 py-6 relative z-10">
          {!hasTurns ? (
            /* Hero State matching mockup */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 pt-4 pb-20">
              {/* Glowing Orbital Emblem */}
              <div className="relative flex items-center justify-center">
                {/* Outer decorative circuits & rings */}
                <div className="w-24 h-24 rounded-full border border-orange-200/80 animate-spin-slow absolute pointer-events-none" />
                <div className="w-32 h-32 rounded-full border border-dashed border-amber-300/40 pointer-events-none absolute" />
                
                {/* Center Core Swirl */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#16171a] via-[#212328] to-[#121316] text-white flex items-center justify-center shadow-xl shadow-brand-500/15 z-10 border border-stone-700">
                  <Sparkles className="w-8 h-8 text-brand-400 animate-pulse" />
                </div>
              </div>

              {/* Catchy Hero Headings */}
              <div className="space-y-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                  Unleash AI with InboxPilot — Smarter Ideas and Insights at your Fingertips
                </h1>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
                  Turn your email archive into instant intelligence. Ask questions, track commitments, and uncover grounded answers with citations.
                </p>
              </div>

              {/* Suggestions Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {promptSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(item.query)}
                    className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white border border-stone-200/80 hover:border-brand-300 text-stone-700 hover:text-brand-600 dark:bg-[#1f2127] dark:hover:bg-[#272930] dark:border-stone-700/80 dark:text-stone-300 dark:hover:text-brand-400 dark:hover:border-brand-500/50 text-xs font-medium shadow-xs transition-all hover:scale-102 active:scale-98"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Chat Thread */
            <div className="max-w-3xl mx-auto space-y-6 pb-28 pt-2">
              {turns.map((turn, index) => (
                <div key={index} className="space-y-4">
                  {/* User Turn */}
                  <div className="flex items-start justify-end space-x-2.5">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-tr from-stone-900 to-stone-800 dark:from-[#2c2f36] dark:to-[#22242a] text-white px-4 py-3 shadow-md border dark:border-stone-700/60">
                      <p className="text-[14px] leading-relaxed select-text font-normal">
                        {turn.question}
                      </p>
                    </div>
                    <img
                      src={user?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"}
                      alt="User"
                      className="w-8 h-8 rounded-full border border-stone-300 dark:border-stone-700 object-cover shrink-0 mt-0.5"
                    />
                  </div>

                  {/* Assistant Turn */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#16171a] to-[#2a2c31] text-brand-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-stone-700">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div className="flex-1 rounded-2xl rounded-tl-sm bg-white/90 dark:bg-[#1a1c21] border border-stone-200/80 dark:border-stone-800 p-4 shadow-xs select-text">
                      {turn.answer ? (
                        <>
                          {renderFormattedAnswer(turn.answer, turn.sources)}

                          {/* Sources row if citations are present */}
                          {turn.sources && turn.sources.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                Cited Sources:
                              </span>
                              {turn.sources.map((src) => (
                                <button
                                  key={src.source_id}
                                  onClick={() => setSelectedSource(src)}
                                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-orange-50 border border-stone-200 hover:border-brand-300 text-stone-700 hover:text-brand-600 dark:bg-stone-800 dark:hover:bg-stone-700 dark:border-stone-700 dark:text-stone-300 dark:hover:text-brand-400 text-xs transition-all"
                                  title={`Open source: ${src.subject}`}
                                >
                                  <span className="font-bold text-brand-600 dark:text-brand-400">{src.source_id}</span>
                                  <span className="font-medium truncate max-w-[150px]">{src.subject}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Action footer */}
                          <div className="mt-3 flex items-center justify-between text-stone-400 dark:text-stone-500 text-xs pt-1">
                            <span className="text-[11px] text-stone-400 dark:text-stone-500">
                              Grounded with InboxPilot RAG & Pinecone Vector Store
                            </span>
                            <button
                              onClick={() => handleCopy(turn.answer, index)}
                              className="flex items-center space-x-1 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded transition-colors"
                            >
                              {copiedTurnIndex === index ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        /* Generating indicator */
                        <div className="flex items-center space-x-2 py-2 text-stone-500 dark:text-stone-400 text-xs">
                          <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
                          <span>Searching Pinecone vector index & synthesizing email evidence...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Bottom Prompt Box (matching mockup) */}
        <div className="px-5 md:px-12 pb-5 z-20 shrink-0">
          <div className="max-w-2xl mx-auto relative rounded-3xl bg-white/95 dark:bg-[#1a1c21]/95 border border-stone-200/90 dark:border-stone-700/80 shadow-xl shadow-stone-900/5 dark:shadow-2xl backdrop-blur-xl overflow-hidden focus-within:border-brand-400 transition-all">
            
            {/* Input Row */}
            <form onSubmit={handleSubmit} className="p-3.5 flex flex-col space-y-2">
              <textarea
                rows={1}
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full bg-transparent resize-none border-none outline-none text-stone-800 dark:text-stone-100 text-sm placeholder-stone-400 dark:placeholder-stone-500 leading-relaxed max-h-36 overflow-y-auto"
              />

              {/* Bottom Controls inside prompt bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  {/* Plus Button */}
                  <button
                    type="button"
                    onClick={() => setInputQuestion("Summarize emails from the last 7 days")}
                    className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors"
                    title="Add prompt attachment / filter"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Think Longer Pill */}
                  <button
                    type="button"
                    onClick={() => setThinkLonger(!thinkLonger)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      thinkLonger
                        ? "bg-gradient-to-r from-sky-500 to-amber-500 text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Think Longer</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Mic Icon */}
                  <button
                    type="button"
                    onClick={() => alert("Speech recognition is ready. Speak your question!")}
                    className="w-7 h-7 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center transition-colors"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Orange Circular Submit Button */}
                  <button
                    type="submit"
                    disabled={!inputQuestion.trim() || isGenerating}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md shadow-brand-500/30 transition-transform active:scale-90"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
