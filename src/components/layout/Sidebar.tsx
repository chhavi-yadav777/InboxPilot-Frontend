import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquarePlus,
  Search,
  Home,
  Layers,
  Compass,
  RefreshCw,
  LogOut,
  Settings,
  MessageSquare,
  X,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { useEmail } from "../../context/EmailContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const Sidebar: React.FC = () => {
  const { user, logout, backendHealth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    chatSessions,
    activeConversationId,
    selectSession,
    searchFilter,
    setSearchFilter,
    thinkLonger,
    setThinkLonger,
    startNewChat,
    sendMessage,
  } = useChat();
  const { triggerSync, isSyncing, setIsExplorerOpen, totalEmails } = useEmail();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const matchingSessions = chatSessions.filter((s) =>
    (s.last_question || "").toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (matchingSessions.length > 0) {
        selectSession(matchingSessions[0].conversation_id);
        setIsSearchFocused(false);
      } else if (searchFilter.trim()) {
        sendMessage(searchFilter.trim());
        setSearchFilter("");
        setIsSearchFocused(false);
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  return (
    <aside className="w-[260px] lg:w-[280px] h-full flex flex-col justify-between p-3.5 bg-[#121316] text-stone-200 border-r border-stone-800/80 select-none shrink-0 overflow-y-auto">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Brand & App Name */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div
            onClick={startNewChat}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1c1e22] to-[#2d3036] text-brand-400 border border-stone-700/80 shadow-md flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95">
              <Sparkles className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white">InboxPilot</span>
              <span className="block text-[10px] text-stone-500 font-medium">Email Intelligence</span>
            </div>
          </div>

          {/* Health indicator */}
          <div
            className="w-2.5 h-2.5 rounded-full border border-stone-800 shadow-xs"
            style={{
              backgroundColor: backendHealth.status === "ok" ? "#10b981" : "#ef4444",
            }}
            title={`API Health: ${backendHealth.status}`}
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={startNewChat}
          className="w-full h-11 px-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white flex items-center justify-between transition-all group shadow-md shadow-brand-500/20 active:scale-[0.99]"
        >
          <div className="flex items-center space-x-2.5">
            <MessageSquarePlus className="w-4 h-4 text-white" />
            <span className="font-bold text-xs text-white">New Chat</span>
          </div>
          <kbd className="text-[10px] font-mono text-white/80 bg-black/20 px-1.5 py-0.5 rounded">
            ⌘N
          </kbd>
        </button>

        {/* Search Bar with Live Filter & Dropdown */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search conversations..."
            value={searchFilter}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => setSearchFilter(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full h-9 pl-9 pr-14 rounded-xl bg-[#18191d] border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-stone-600 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {searchFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearchFilter("");
                  searchInputRef.current?.focus();
                }}
                className="text-stone-400 hover:text-stone-200 p-0.5 rounded transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="text-[10px] font-mono text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Floating Live Search Dropdown when focused and query present */}
          {isSearchFocused && searchFilter.trim() && (
            <div className="absolute left-0 right-0 mt-1.5 rounded-xl bg-[#1a1c21] border border-stone-700/80 shadow-2xl p-2 z-50 text-xs max-h-60 overflow-y-auto space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between border-b border-stone-800 pb-1">
                <span>Matching Chats</span>
                <span className="font-mono text-brand-400">{matchingSessions.length}</span>
              </div>

              {matchingSessions.length > 0 ? (
                matchingSessions.slice(0, 5).map((session) => (
                  <button
                    key={session.conversation_id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSession(session.conversation_id);
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white flex items-center space-x-2 transition-colors group"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate flex-1 font-medium">{session.last_question || "New Chat"}</span>
                    <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-brand-400 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-2 text-stone-500 text-[11px] text-center">
                  No matching past chats
                </div>
              )}

              {/* Quick action: search via chat */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  sendMessage(searchFilter.trim());
                  setSearchFilter("");
                  setIsSearchFocused(false);
                }}
                className="pt-1 border-t border-stone-800"
              >
                <button
                  type="button"
                  className="w-full text-left p-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-[11px] font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="truncate">Ask: "{searchFilter}"</span>
                  <span className="text-[10px] bg-black/40 px-1 py-0.5 rounded font-mono text-stone-400">↵</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Core Navigation Links */}
        <div className="space-y-1 pt-1">
          <div className="px-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            Navigation
          </div>

          {/* Home */}
          <button
            onClick={startNewChat}
            className="w-full h-9 px-3 rounded-xl bg-[#1c1e22] text-white flex items-center space-x-2.5 text-xs font-semibold shadow-xs transition-all"
          >
            <Home className="w-4 h-4 text-brand-400" />
            <span>Chat Canvas</span>
          </button>

          {/* Mailbox Library */}
          <button
            onClick={() => setIsExplorerOpen(true)}
            className="w-full h-9 px-3 rounded-xl hover:bg-[#1a1c20] text-stone-400 hover:text-stone-200 flex items-center justify-between text-xs font-medium transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-stone-400 group-hover:text-stone-200" />
              <span>Mailbox Explorer</span>
            </div>
            {totalEmails > 0 && (
              <span className="text-[10px] font-mono bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded">
                {totalEmails}
              </span>
            )}
          </button>

          {/* Sync Mailbox Action */}
          <button
            onClick={() => triggerSync()}
            disabled={isSyncing}
            className="w-full h-9 px-3 rounded-xl hover:bg-[#1a1c20] text-stone-400 hover:text-stone-200 flex items-center justify-between text-xs font-medium transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <RefreshCw
                className={`w-4 h-4 text-stone-400 group-hover:text-brand-400 ${
                  isSyncing ? "animate-spin text-brand-400" : ""
                }`}
              />
              <span>{isSyncing ? "Syncing emails..." : "Sync Gmail Inbox"}</span>
            </div>
            {isSyncing && <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />}
          </button>
        </div>

        {/* AI Modes & Search Depth */}
        <div className="space-y-1.5 pt-2">
          <div className="px-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            Reasoning Modes
          </div>

          {/* Think Longer Pill Toggle */}
          <button
            onClick={() => setThinkLonger(!thinkLonger)}
            className={`w-full h-10 px-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${
              thinkLonger
                ? "bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 text-white shadow-md shadow-amber-900/20"
                : "bg-[#18191d] text-stone-400 hover:text-stone-200 hover:bg-[#202227]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className={`w-4 h-4 ${thinkLonger ? "text-amber-200 animate-pulse" : "text-stone-400"}`} />
              <span>Think Longer</span>
            </div>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">
              {thinkLonger ? "ON" : "OFF"}
            </span>
          </button>

          {/* Deep Research */}
          <button
            onClick={() =>
              sendMessage("Perform deep research on my emails regarding upcoming deadlines and commitments")
            }
            className="w-full h-9 px-3 rounded-xl bg-[#18191d] hover:bg-[#202227] text-stone-400 hover:text-stone-200 flex items-center space-x-2 text-xs font-medium transition-all group"
          >
            <Compass className="w-4 h-4 text-stone-400 group-hover:text-stone-200" />
            <span>Deep Email Research</span>
          </button>
        </div>

        {/* Recent Conversations List in Sidebar */}
        <div className="space-y-1.5 pt-2">
          <div className="px-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
            <span>{searchFilter ? "Filtered Chats" : "Recent Chats"}</span>
            {chatSessions.length > 0 && (
              <span className="text-[10px] text-stone-500 font-mono">
                {searchFilter ? matchingSessions.length : chatSessions.length}
              </span>
            )}
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
            {(searchFilter ? matchingSessions : chatSessions.slice(0, 8)).map((session) => {
              const isActive = activeConversationId === session.conversation_id;
              return (
                <button
                  key={session.conversation_id}
                  onClick={() => selectSession(session.conversation_id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center space-x-2 transition-all truncate ${
                    isActive
                      ? "bg-[#22242a] text-brand-400 font-semibold border border-stone-700/60 shadow-2xs"
                      : "text-stone-400 hover:text-stone-200 hover:bg-[#1a1c20]"
                  }`}
                  title={session.last_question || "New Chat"}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate flex-1">{session.last_question || "New Chat"}</span>
                </button>
              );
            })}

            {chatSessions.length === 0 && (
              <div className="px-2 py-2 text-stone-600 text-[11px] italic">
                No past chats found
              </div>
            )}

            {searchFilter && matchingSessions.length === 0 && (
              <div className="px-2 py-2 text-stone-500 text-[11px]">
                No chats match "{searchFilter}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Account & Log Out Bar */}
      <div className="pt-3 border-t border-stone-800/80 mt-auto">
        {user ? (
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-[#18191d] border border-stone-800">
            <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-1">
              <img
                src={
                  user.picture ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                }
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-stone-700 shrink-0"
              />
              <div className="min-w-0 flex-1 truncate">
                <p className="text-xs font-bold text-stone-200 truncate">{user.name}</p>
                <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-400 hover:-rotate-12 transition-transform" />
                )}
              </button>
              <button
                onClick={() => setIsExplorerOpen(true)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                title="Mailbox Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
                title="Log Out of InboxPilot"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-[11px] text-stone-500">Not signed in</span>
          </div>
        )}
      </div>
    </aside>
  );
};
