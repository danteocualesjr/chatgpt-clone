export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string; // base64 data URL for images, or file info
  mimeType: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  error: string | null;
}
