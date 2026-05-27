export interface PDFDocument {
  id: string;
  name: string;
  size: string;
  pages: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  chunks: number;
  isOCRScanned?: boolean;
  ocrProgress?: number;
  uploadDate: string;
}

export interface RAGSource {
  textChunk: string;
  pageNumber: number;
  confidence: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isVoiceInput?: boolean;
  isVoiceReply?: boolean;
  ragSources?: RAGSource[];
  visualPreviewUrl?: string; // For multimodal diagrams/images explanation
  confidenceScore?: number; // Similarity/confidence score
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface AnalyticsData {
  documentsProcessed: number;
  questionsAsked: number;
  totalStorageUsed: string;
  totalPages: number;
  activityLog: { date: string; count: number }[];
  responseTimeAvg: number;
  modelUsage: { name: string; percentage: number }[];
}

export interface SystemSettings {
  apiKey: string;
  selectedModel: string;
  voiceSynthesisEnabled: boolean;
  selectedVoice: string;
  selectedLanguage: string;
  mockMode: boolean;
}
