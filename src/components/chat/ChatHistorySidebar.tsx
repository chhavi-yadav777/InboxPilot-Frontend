import React, { useRef, useEffect } from "react";
import {
  ChevronDown,
  Edit3,
  Search,
  MessageSquare,
  CheckCircle2,
  Circle,
  Plus,
  X,
} from "lucide-react";
import { useChat } from "../../context/ChatContext";

export const ChatHistorySidebar: React.FC = () => {
  const {
    chatSessions,
    activeConversationId,
    selectSession,
    startNewChat,
    searchFilter,
    setSearchFilter,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = chatSessions.filter((s) =>
    (s.last_question || "New Chat").toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Split into Today and Yesterday/Older
  const todayItems = filtered.slice(0, 4);
  const olderItems = filtered.slice(4);

  return (
    <aside className="w-[260px] lg:w-[280px] h-full flex flex-col justify-between py-4 px-3 bg-[#faf7f2] dark:bg-[#121316] border-l border-[#ece6dc] dark:border-stone-800/80 select-none shrink-0 overflow-y-auto">
      <div className="space-y-4">
        {/* Header with Title and Compose */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5 text-stone-800 dark:text-stone-200 font-bold text-sm">
            <MessageSquare className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Chat History</span>
            {filtered.length > 0 && (
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">({filtered.length})</span>
            )}
          </div>

          <button
            onClick={startNewChat}
            className="w-7 h-7 rounded-lg hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center transition-colors"
            title="Start New Chat"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search Chats Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search chats..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full h-8 pl-8 pr-12 rounded-lg bg-white dark:bg-[#18191d] border border-[#e4ded4] dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-brand-400 transition-colors shadow-2xs"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {searchFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearchFilter("");
                  inputRef.current?.focus();
                }}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5 rounded transition-colors"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <kbd className="text-[9px] font-mono text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                ⌘F
              </kbd>
            )}
          </div>
        </div>

        {/* Groups or Empty State */}
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-stone-400 dark:text-stone-500 text-xs space-y-2">
            <p>{searchFilter ? `No chats match "${searchFilter}"` : "No conversations yet"}</p>
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter("")}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5 pt-1">
            {/* TODAY Group */}
            {todayItems.length > 0 && (
              <div className="space-y-1.5">
                <div className="px-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                  TODAY
                </div>

                <div className="space-y-1">
                  {todayItems.map((item, idx) => {
                    const isActive = activeConversationId === item.conversation_id;
                    return (
                      <div
                        key={item.conversation_id || idx}
                        onClick={() => selectSession(item.conversation_id)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all group ${
                          isActive
                            ? "bg-white dark:bg-[#1a1c21] border border-stone-200/90 dark:border-stone-700/80 shadow-xs"
                            : "hover:bg-stone-200/50 dark:hover:bg-stone-800/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p
                            className={`text-xs font-medium truncate ${
                              isActive
                                ? "text-brand-600 dark:text-brand-400 font-semibold"
                                : "text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100"
                            }`}
                          >
                            {item.last_question || "New Chat"}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                            {item.last_activity ? new Date(item.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Today, ${4 + idx}:22 am`}
                          </p>
                        </div>

                        <div className="text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0">
                          <Circle className="w-3.5 h-3.5 stroke-[1.8]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* YESTERDAY / PREVIOUS Group */}
            {olderItems.length > 0 && (
              <div className="space-y-1.5">
                <div className="px-1 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                  PREVIOUS
                </div>

                <div className="space-y-1">
                  {olderItems.map((item, idx) => {
                    const isActive = activeConversationId === item.conversation_id;
                    return (
                      <div
                        key={item.conversation_id || idx}
                        onClick={() => selectSession(item.conversation_id)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all group ${
                          isActive
                            ? "bg-white dark:bg-[#1a1c21] border border-stone-200/90 dark:border-stone-700/80 shadow-xs"
                            : "hover:bg-stone-200/50 dark:hover:bg-stone-800/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p
                            className={`text-xs font-medium truncate ${
                              isActive
                                ? "text-brand-600 dark:text-brand-400 font-semibold"
                                : "text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100"
                            }`}
                          >
                            {item.last_question || "New Chat"}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                            {item.last_activity ? new Date(item.last_activity).toLocaleDateString([], { month: 'short', day: 'numeric' }) : `Yesterday, ${9 + idx}:17 am`}
                          </p>
                        </div>

                        <div className="text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0">
                          <MessageSquare className="w-3.5 h-3.5 stroke-[1.8]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom status */}
      <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/80 px-1">
        <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center">
          Encrypted & synchronized with MongoDB
        </p>
      </div>
    </aside>
  );
};
