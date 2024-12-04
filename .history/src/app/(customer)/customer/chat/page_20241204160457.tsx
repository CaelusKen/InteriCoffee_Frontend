'use client'

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/service/firebase'
import { socket, connectSocket, disconnectSocket } from '@/lib/socket'
import { ChatMessage } from '@/components/custom/chat/chat-message'
import { ChatInput } from '@/components/custom/chat/chat-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  roomId: string
}

export default function ChatDashboard() {
  const [user] = useAuthState(auth)
  const [messages, setMessages] = useState<Message[]>([])
  const roomId = 'general' // You can make this dynamic

  useEffect(() => {
    if (!user) return

    // Connect to Socket.IO
    connectSocket()
    socket.emit('join_room', roomId)

    // Listen for new messages from Socket.IO
    socket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    // Set up Firestore listener
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]
      setMessages(newMessages)
    })

    return () => {
      disconnectSocket()
      unsubscribe()
    }
  }, [user])

  const handleSendMessage = async (text: string) => {
    if (!user) return

    const message = {
      text,
      sender: user.email || 'Anonymous',
      timestamp: new Date(),
      roomId
    }

    // Send to Socket.IO for real-time updates
    socket.emit('send_message', message)

    // Store in Firebase
    await addDoc(collection(db, 'messages'), message)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Chat Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
                isCurrentUser={message.sender === user?.email}
              />
            ))}
          </div>
          <div className="border-t p-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}