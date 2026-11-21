export interface User {
  id: string;
  google_sub: string;
  email: string;
  name: string;
  picture: string;
  checkpoint_timestamp: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmailSource {
  source_id: string;
  email_id: string;
  thread_id: string;
  subject: string;
  sender: string;
  receiver: string;
  date: string;
  score: number;
  snippet: string;
}

export interface EmailItem {
  email_id: string;
  thread_id: string;
  subject: string;
  sender: string;
  receiver: string;
  date: string;
  body: string;
}

export interface EmailListResponse {
  items: EmailItem[];
  limit: number;
  offset: number;
  total: number;
}

export interface ChatTurn {
  question: string;
  answer: string;
  sources: EmailSource[];
  created_at?: string;
}

export interface ChatSession {
  conversation_id: string;
  last_activity: string;
  last_question: string;
  turn_count: number;
}

export interface IngestionStatus {
  fetched: number;
  stored: number;
  indexed: number;
  checkpoint_timestamp: string | null;
}

export interface HealthStatus {
  status: 'ok' | 'unavailable' | 'checking';
  error?: string;
}
