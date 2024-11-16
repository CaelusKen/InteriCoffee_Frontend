'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  id: string
  sender: string
  content: string
  timestamp: string
}

export default function MessageThread({ merchantId, initialMessages }: { merchantId: string, initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'User',
        content: newMessage,
        timestamp: new Date().toISOString()
      }
      setMessages([...messages, message])
      setNewMessage('')
      // Here you would typically send the message to your backend
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Messages with Merchant {merchantId}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.sender === 'User' ? 'text-right' : 'text-left'}`}>
            <p className="font-semibold">{message.sender}</p>
            <p className="bg-muted p-2 rounded-lg inline-block">{message.content}</p>
            <p className="text-xs text-muted-foreground">{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="mr-2"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </CardFooter>
    </Card>
  )
}