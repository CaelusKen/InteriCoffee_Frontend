'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ref, push, onValue, off, set } from 'firebase/database'
import { db } from '@/service/firebase'
import { v4 as uuidv4 } from 'uuid'
import { Account, Message, Merchant, ChatSession } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { ApiResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Paperclip } from 'lucide-react'

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { sessionId } = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const fetchMerchant = async (merchantId: string): Promise<ApiResponse<Merchant>> => {
    return api.get<Merchant>(`merchants/${merchantId}`)
  }

  const { data: merchantData } = useQuery({
    queryKey: ['merchant', sessionId],
    queryFn: () => fetchMerchant(sessionId as string),
    enabled: !!sessionId
  })

  const merchant = merchantData?.data

  useEffect(() => {
    if (!sessionId || !account) return

    const chatRef = ref(db, `chats/${sessionId}`)
    
    onValue(chatRef, async (snapshot) => {
      const data = snapshot.val()
      if (data) {
        if (data.messages) {
          setMessages(Object.values(data.messages))
        }
      } else {
        // If chat doesn't exist, create a new one
        const newChat: ChatSession = {
          id: sessionId as string,
          messages: [],
          createdDate: new Date(),
          updatedDate: new Date(),
          customerId: account.id,
          advisorId: merchant?.id || ''
        }
        await set(chatRef, newChat)
      }
    })

    return () => off(chatRef)
  }, [sessionId, account, merchant])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || (!newMessage.trim() && !file)) return;

    const fileUrl = '';
    if (file) {
      // TODO: Implement file upload logic here
      // This could involve uploading to Firebase Storage or your own server
      // fileUrl = await uploadFile(file);
    }

    const message: Message = {
      id: uuidv4(),
      sender: account?.id ?? '',
      message: newMessage,
      timeStamp: new Date(),
      fileUrl: fileUrl
    };

    const chatRef = ref(db, `chats/${sessionId}/messages`);
    await push(chatRef, message);

    // Update the last message and updated date
    const chatUpdateRef = ref(db, `chats/${sessionId}`);
    await set(chatUpdateRef, {
      updatedDate: new Date().toISOString(),
      lastMessage: newMessage
    });

    setNewMessage('');
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
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
        <CardTitle>Chat with {merchant?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.sender === account?.id ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
            }`}
          >
            <p>{msg.message}</p>
            {msg.fileUrl && (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Attached File
              </a>
            )}
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
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}

