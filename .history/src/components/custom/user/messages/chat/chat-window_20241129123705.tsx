'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { firebaseChat, ChatMessage } from '@/lib/firebase-chat'
import { useSession } from 'next-auth/react'
import { Paperclip } from 'lucide-react'

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { sessionId } = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.email || !sessionId) return

    const unsubscribe = firebaseChat.listenToMessages(session.user.email, sessionId as string, (newMessages) => {
      setMessages(newMessages)
    })

    return () => unsubscribe()
  }, [session, sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email || !sessionId || (!newMessage.trim() && !file)) return

    await firebaseChat.sendMessage(session.user.email, sessionId as string, newMessage, file || undefined)

    setNewMessage('')
    setFile(null)
  }

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
        <CardTitle>Chat Session</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.sender === session?.user?.email ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
            }`}
          >
            <p>{msg.content}</p>
            {msg.fileUrl && (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Attached File
              </a>
            )}
            <small className="text-xs opacity-70">
              {new Date(msg.timestamp).toLocaleString()}
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