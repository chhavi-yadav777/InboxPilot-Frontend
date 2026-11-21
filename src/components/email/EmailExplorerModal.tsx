import React, { useState } from "react";
import {
  X,
  Mail,
  RefreshCw,
  Database,
  Search,
  Calendar,
  User,
  ArrowUpDown,
  Download,
  CheckCircle,
} from "lucide-react";
import { useEmail } from "../../context/EmailContext";
import { EmailItem } from "../../types";

export const EmailExplorerModal: React.FC = () => {
  const {
    isExplorerOpen,
    setIsExplorerOpen,
    emails,
    totalEmails,
    isSyncing,
    isFetching,
    isReindexing,
    triggerSync,
    triggerFullFetch,
    triggerReindex,
  } = useEmail();

  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  if (!isExplorerOpen) return null;

  const filtered = emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.sender.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl h-[85vh] rounded-2xl bg-white dark:bg-[#151619] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-[#faf7f2] dark:bg-[#1a1c21]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Email Mailbox Explorer
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {totalEmails} emails stored in MongoDB & indexed in Pinecone
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sync actions */}
            <button
              onClick={triggerSync}
              disabled={isSyncing || isFetching}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#22242a] border border-stone-200 dark:border-stone-700 hover:border-brand-300 text-stone-700 dark:text-stone-300 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-brand-500" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync (Incremental)"}</span>
            </button>

            <button
              onClick={triggerFullFetch}
              disabled={isSyncing || isFetching}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#22242a] border border-stone-200 dark:border-stone-700 hover:border-brand-300 text-stone-700 dark:text-stone-300 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-brand-500" : ""}`} />
              <span>{isFetching ? "Fetching..." : "Fetch All Mailbox"}</span>
            </button>

            <button
              onClick={triggerReindex}
              disabled={isReindexing}
              className="px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-brand-600 hover:bg-stone-800 dark:hover:bg-brand-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all disabled:opacity-50"
            >
              <Database className={`w-3.5 h-3.5 ${isReindexing ? "animate-spin text-brand-400" : ""}`} />
              <span>{isReindexing ? "Indexing..." : "Re-index Pinecone"}</span>
            </button>

            <button
              onClick={() => setIsExplorerOpen(false)}
              className="w-8 h-8 rounded-xl hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-[#18191d]/60 flex items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input
              type="text"
              placeholder="Search indexed emails by subject, sender, or body keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-white dark:bg-[#202227] border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-brand-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Split View: Emails list on left, details on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className="w-1/2 border-r border-stone-200 dark:border-stone-800 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-stone-400 dark:text-stone-500 text-xs">
                No matching emails found.
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedEmail?.email_id === item.email_id;
                return (
                  <div
                    key={item.email_id}
                    onClick={() => setSelectedEmail(item)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-orange-50/80 dark:bg-brand-950/40 border-l-4 border-l-brand-500"
                        : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                        {item.sender}
                      </span>
                      <span className="text-[11px] text-stone-400 dark:text-stone-500">{item.date}</span>
                    </div>
                    <h4 className="text-xs font-medium text-stone-900 dark:text-stone-100 mt-1 truncate">
                      {item.subject}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Email Body Inspector */}
          <div className="w-1/2 p-5 overflow-y-auto bg-stone-50/30 dark:bg-[#121316]/50">
            {selectedEmail ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {selectedEmail.subject}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                    <div>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">From:</span> {selectedEmail.sender}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">To:</span> {selectedEmail.receiver}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">Date:</span> {selectedEmail.date}
                    </div>
                    <div className="font-mono text-[11px] text-stone-400 dark:text-stone-500">
                      ID: {selectedEmail.email_id} | Thread: {selectedEmail.thread_id}
                    </div>
                  </div>
                </div>

                <hr className="border-stone-200 dark:border-stone-800" />

                <div className="text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {selectedEmail.body}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 dark:text-stone-500 text-xs space-y-2">
                <Mail className="w-8 h-8 stroke-[1.5] text-stone-300 dark:text-stone-600" />
                <p>Select an email from the list to preview full contents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
