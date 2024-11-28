'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ref, push, onValue, off } from 'firebase/database'
import { db } from '@/service/firebase'
import { v4 as uuidv4 } from 'uuid'
import { Account, Message } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { ApiResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'


export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { sessionId } = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()

  const fetchAccount = async(): Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${session?.user.email}/info`)
  }

  const accountQuery = useQuery({
    queryKey: ['account', session?.user.email],
    queryFn: () => fetchAccount(),
    enabled: !!session?.user.email
  })

  const account = accountQuery.data?.data

  useEffect(() => {
    if (!sessionId) return

    const chatRef = ref(db, `chats/${sessionId}`)
    
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.messages) {
        setMessages(Object.values(data.messages))
      }
    })

    return () => off(chatRef)
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId || newMessage.trim() === '') return

    const message: Message = {
      id: uuidv4(),
      sender: 'customer', // Assuming the customer is sending the message
      message: newMessage,
      timeStamp: new Date(),
    }

    const chatRef = ref(db, `chats/${sessionId}/messages`)
    push(chatRef, message)

    setNewMessage('')
  }

  if (!sessionId) {
    return (
      <Card className="flex-1 h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Select a chat session to start messaging</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-1 h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat Session: {sessionId}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.sender === 'customer' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
            }`}
          >
            <p>{msg.message}</p>
            <small className="text-xs opacity-70">
              {new Date(msg.timeStamp).toLocaleString()}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={sendMessage} className="flex w-full space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}

