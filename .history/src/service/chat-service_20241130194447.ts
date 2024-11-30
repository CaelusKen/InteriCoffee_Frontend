import { api } from "./api"
import { db } from "./firebase"
import { ref, set, onValue, off } from 'firebase/database'

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  attachments?: string[]
}

export interface ChatSession {
  id: string
  customerId: string
  merchantId: string
  consultantId?: string
  messages: Message[]
  lastUpdated: string
}

export class ChatService {
  private static instance: ChatService
  private socket: WebSocket | null = null

  private constructor() {
    // Initialize WebSocket connection
    this.initializeWebSocket()
  }

  static getInstance(): ChatService {
    if (!this.instance) {
      this.instance = new ChatService()
    }
    return this.instance
  }

  private initializeWebSocket() {
    this.socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    this.socket.onmessage = this.handleWebSocketMessage
  }

  private handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    // Handle different types of real-time updates
    switch (data.type) {
      case 'NEW_MESSAGE':
        this.handleNewMessage(data.payload)
        break
      case 'CONSULTANT_ASSIGNED':
        this.handleConsultantAssigned(data.payload)
        break
      // Add more cases as needed
    }
  }

  async createChatSession(customerId: string, merchantId: string): Promise<ChatSession> {
    try {
        const createChatSessionData = {
            "customer-id": customerId,
            "advisor-id": merchantId,
            messages: [],
        }
      // Create session in backend API
      const response = await api.post<ChatSession>('chat-sessions', createChatSessionData)

      if (response.status !== 200) throw new Error('Failed to create chat session')

      const session = await response.data

      // Initialize Firebase real-time listener
      this.initializeFirebaseListener(session.id)

      return session
    } catch (error) {
      console.error('Error creating chat session:', error)
      throw error
    }
  }

  import { ref, DatabaseReference, onValue, off } from 'firebase/database';

  // ...
  private initializeFirebaseListener(sessionId: string) {
    const chatRef: DatabaseReference = ref(db, `chats/${sessionId}`);
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update local state/cache with new data
        this.updateLocalChat(data);
      }
    });
  }

  // ...

  cleanup(sessionId: string) {
    const chatRef: DatabaseReference = ref(db, `chats/${sessionId}`);
    off(chatRef);
    this.socket?.close();
  }


  async sendMessage(sessionId: string, message: Omit<Message, 'id'>): Promise<void> {
    try {
      // Send to backend API
      await fetch(`/api/v1/chat-sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      })

      // Send through WebSocket for real-time delivery
      this.socket?.send(JSON.stringify({
        type: 'NEW_MESSAGE',
        payload: {
          sessionId,
          message,
        },
      }))
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  async assignConsultant(sessionId: string, consultantId: string): Promise<void> {
    try {
      await fetch(`/api/v1/chat-sessions/${sessionId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consultantId }),
      })
    } catch (error) {
      console.error('Error assigning consultant:', error)
      throw error
    }
  }

  // Clean up method
  cleanup(sessionId: string) {
    const chatRef = ref(db, `chats/${sessionId}`)
    off(chatRef)
    this.socket?.close()
  }
}