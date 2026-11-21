import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { EmailItem, EmailSource, IngestionStatus } from "../types";
import {
  syncEmails,
  fetchAllEmails,
  reindexStoredEmails,
  listEmails,
} from "../services/api";
import { useAuth } from "./AuthContext";

interface EmailContextType {
  isSyncing: boolean;
  isFetching: boolean;
  isReindexing: boolean;
  lastSyncResult: IngestionStatus | null;
  emails: EmailItem[];
  totalEmails: number;
  selectedSource: EmailSource | null;
  setSelectedSource: (source: EmailSource | null) => void;
  isExplorerOpen: boolean;
  setIsExplorerOpen: (open: boolean) => void;
  triggerSync: () => Promise<void>;
  triggerFullFetch: () => Promise<void>;
  triggerReindex: () => Promise<void>;
  refreshEmails: () => Promise<void>;
  toastMessage: string | null;
  clearToast: () => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user, refreshUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isReindexing, setIsReindexing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<IngestionStatus | null>(null);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [totalEmails, setTotalEmails] = useState<number>(0);
  const [selectedSource, setSelectedSource] = useState<EmailSource | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const refreshEmails = async () => {
    try {
      const data = await listEmails(token, 50, 0);
      setEmails(data.items);
      setTotalEmails(data.total);
    } catch (err: any) {
      console.warn("Failed to load emails:", err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshEmails();
    }
  }, [user]);

  const triggerSync = async () => {
    setIsSyncing(true);
    showToast("Starting incremental email sync...");
    try {
      const result = await syncEmails(token);
      setLastSyncResult(result);
      await refreshUser();
      await refreshEmails();
      showToast(`Sync complete! Fetched: ${result.fetched}, Indexed: ${result.indexed} messages.`);
    } catch (err: any) {
      showToast(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerFullFetch = async () => {
    setIsFetching(true);
    showToast("Fetching complete Gmail mailbox... This may take a minute.");
    try {
      const result = await fetchAllEmails(token);
      setLastSyncResult(result);
      await refreshUser();
      await refreshEmails();
      showToast(`Full mailbox fetch complete! Indexed ${result.indexed} messages.`);
    } catch (err: any) {
      showToast(`Fetch error: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const triggerReindex = async () => {
    setIsReindexing(true);
    showToast("Reindexing stored email records in Pinecone...");
    try {
      const result = await reindexStoredEmails(token);
      showToast(`Reindexing complete! Re-indexed ${result.indexed} emails.`);
    } catch (err: any) {
      showToast(`Reindex error: ${err.message}`);
    } finally {
      setIsReindexing(false);
    }
  };

  return (
    <EmailContext.Provider
      value={{
        isSyncing,
        isFetching,
        isReindexing,
        lastSyncResult,
        emails,
        totalEmails,
        selectedSource,
        setSelectedSource,
        isExplorerOpen,
        setIsExplorerOpen,
        triggerSync,
        triggerFullFetch,
        triggerReindex,
        refreshEmails,
        toastMessage,
        clearToast: () => setToastMessage(null),
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export function useEmail() {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
}
