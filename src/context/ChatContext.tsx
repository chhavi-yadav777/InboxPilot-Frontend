import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ChatTurn, ChatSession, EmailSource } from "../types";
import {
  sendChatMessage,
  listChatConversations,
  getChatHistory,
} from "../services/api";
import { useAuth } from "./AuthContext";

interface ChatContextType {
  activeConversationId: string | null;
  turns: ChatTurn[];
  chatSessions: ChatSession[];
  isGenerating: boolean;
  thinkLonger: boolean;
  topK: number;
  selectedModel: string;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
  setThinkLonger: (val: boolean) => void;
  setTopK: (k: number) => void;
  setSelectedModel: (model: string) => void;
  startNewChat: () => void;
  sendMessage: (question: string) => Promise<void>;
  selectSession: (conversationId: string) => Promise<void>;
  loadSessions: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [thinkLonger, setThinkLonger] = useState<boolean>(true); // Active by default matching mockup
  const [topK, setTopK] = useState<number>(5);
  const [selectedModel, setSelectedModel] = useState<string>("InboxPilot");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const loadSessions = async () => {
    try {
      const sessions = await listChatConversations(token, 30);
      setChatSessions(sessions);
    } catch (err) {
      console.warn("Could not load sessions:", err);
    }
  };

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const startNewChat = () => {
    setActiveConversationId(null);
    setTurns([]);
  };

  const selectSession = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setIsGenerating(true);
    try {
      const res = await getChatHistory(token, conversationId);
      setTurns(res.items || []);
    } catch (err) {
      console.error("Error loading chat session:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMessage = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isGenerating) return;

    // Optimistically append user message
    const optimisticTurn: ChatTurn = {
      question: trimmed,
      answer: "",
      sources: [],
      created_at: new Date().toISOString(),
    };
    setTurns((prev) => [...prev, optimisticTurn]);
    setIsGenerating(true);

    try {
      const computedTopK = thinkLonger ? Math.max(topK, 8) : topK;
      const response = await sendChatMessage(
        token,
        trimmed,
        computedTopK,
        activeConversationId
      );

      setActiveConversationId(response.conversation_id);

      // Update the turn with assistant's answer and sources
      setTurns((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0) {
          updated[lastIndex] = {
            ...updated[lastIndex],
            answer: response.answer,
            sources: response.sources as EmailSource[],
          };
        }
        return updated;
      });

      // Reload sessions list to keep sidebar updated
      await loadSessions();
    } catch (err: any) {
      console.error("Chat error:", err);
      setTurns((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0) {
          updated[lastIndex] = {
            ...updated[lastIndex],
            answer: `⚠️ **Error generating answer**: ${err.message || "Failed to retrieve email answer. Please retry."}`,
            sources: [],
          };
        }
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        activeConversationId,
        turns,
        chatSessions,
        isGenerating,
        thinkLonger,
        topK,
        selectedModel,
        searchFilter,
        setSearchFilter,
        setThinkLonger,
        setTopK,
        setSelectedModel,
        startNewChat,
        sendMessage,
        selectSession,
        loadSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
