// src/types/chat.types.ts
export type UserShort = {
  id: string;
  username?: string;
  email?: string;
  avatar?: string | null;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read?: boolean;
  createdAt: string;
  updatedAt?: string;
  sender?: UserShort; // optional if server includes sender
};

export type ConversationParticipant = {
  id: string;
  conversationId: string;
  userId: string;
  user?: UserShort;
  joinedAt?: string;
};

export type Conversation = {
  id: string;
  title?: string | null;
  isGroup: boolean;
  participants: ConversationParticipant[];
  messages?: Message[]; // optional preloaded messages
  createdAt: string;
  updatedAt: string;
  // optional UI helpers:
  lastMessage?: Message | null;
  unreadCount?: number;
};
