export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
  status?: 'available' | 'busy' | 'away' | 'offline';
  typing?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'pending';
  type: 'text' | 'image' | 'file' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  thumbnail?: string;
}

export interface Call {
  id: string;
  initiatorId: string;
  receiverId: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'ongoing' | 'ended' | 'missed';
  startTime?: Date;
  endTime?: Date;
}

export interface Reaction {
  messageId: string;
  userId: string;
  emoji: string;
}