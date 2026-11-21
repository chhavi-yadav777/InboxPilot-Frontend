import React from "react";
import { X, Mail, Calendar, User, Hash, ExternalLink, Copy, Check, Sparkles } from "lucide-react";
import { useEmail } from "../../context/EmailContext";

export const SourceInspectorModal: React.FC = () => {
  const { selectedSource, setSelectedSource } = useEmail();
  const [copied, setCopied] = React.useState(false);

  if (!selectedSource) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSource.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scorePercentage = Math.round((selectedSource.score || 0.85) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#151619] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-[#faf7f2] dark:bg-[#1a1c21]">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 font-bold text-xs border border-brand-200 dark:border-brand-800">
              Source {selectedSource.source_id}
            </span>
            <div className="flex items-center space-x-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{scorePercentage}% Vector Match</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedSource(null)}
            className="w-7 h-7 rounded-lg hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Email Subject */}
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
              {selectedSource.subject || "No Subject"}
            </h3>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 dark:bg-[#1a1c21] border border-stone-200/60 dark:border-stone-800 text-xs">
            <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 truncate">
              <User className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
              <span className="truncate font-medium">{selectedSource.sender}</span>
            </div>
            <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-300 truncate">
              <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
              <span>{selectedSource.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 truncate col-span-2">
              <Hash className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
              <span className="font-mono text-[11px] truncate">
                Thread: {selectedSource.thread_id} | Email: {selectedSource.email_id}
              </span>
            </div>
          </div>

          {/* Snippet / Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
              <span>Retrieved Evidence Snippet</span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1e2025] border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-wrap select-text max-h-52 overflow-y-auto">
              {selectedSource.snippet}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 dark:bg-[#18191d] border-t border-stone-100 dark:border-stone-800 flex items-center justify-end space-x-2">
          <button
            onClick={() => setSelectedSource(null)}
            className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
