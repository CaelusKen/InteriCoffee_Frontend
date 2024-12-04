'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/service/firebase'
import { socket, connectSocket, disconnectSocket } from '@/lib/socket'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Message {
  id: string
  text: string
  senderId: string
  receiverId: string
  timestamp: Date
}

interface ChatContextType {
  selectedUser: User | null
  messages: Message[]
  searchUsers: (query: string) => Promise<User[]>
  sendMessage: (text: string) => Promise<void>
  selectUser: (user: User) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    connectSocket()

    socket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      disconnectSocket()
    }
  }, [])

  const searchUsers = async (keyword: string) => {
    if (!keyword.trim()) return []

    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('name', '>=', keyword), where('name', '<=', keyword + '\uf8ff'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[]
  }

  const sendMessage = async (text: string) => {
    if (!selectedUser) return

    const message = {
      text,
      senderId: 'currentUserId', // Replace with actual current user ID
      receiverId: selectedUser.id,
      timestamp: new Date()
    }

    socket.emit('send_message', message)
  }

  const selectUser = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <ChatContext.Provider value={{
      selectedUser,
      messages,
      searchUsers,
      sendMessage,
      selectUser
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}