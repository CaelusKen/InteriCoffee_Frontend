import { Timestamp } from 'firebase/firestore'

export interface FirestoreChat {
  id: string
  participants: FirestoreChatParticipant[]
  createdAt: Date
  updatedAt: Date
  lastMessage?: {
    content: string
    timestamp: Timestamp
    senderId: string
    type: 'text' | 'image' | 'video'
  }
}

export interface FirestoreChatParticipant {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  lastRead?: Timestamp
}

export interface FirestoreMessage {
  id: string
  chatId: string
  content: string
  senderId: string
  timestamp: Timestamp
  type: 'text' | 'image' | 'video'
  fileUrl?: string
  status: 'sent' | 'delivered' | 'read'
}