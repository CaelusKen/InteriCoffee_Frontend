'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  sender: 'User' | 'Merchant'
  content: string
  timestamp: string
}

type Merchant = {
  id: string
  name: string
  avatar: string
  lastMessage: string
}

const mockMerchants: Merchant[] = [
  { id: '1', name: 'Acme Corp', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Hello! How can I help you?' },
  { id: '2', name: 'XYZ Industries', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Your order has been shipped.' },
  { id: '3', name: 'Tech Innovators', avatar: '/placeholder.svg?height=40&width=40', lastMessage: 'Thank you for your inquiry.' },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', sender: 'Merchant', content: 'Hello! How can I help you today?', timestamp: '2023-06-01T10:00:00Z' },
    { id: '2', sender: 'User', content: 'Hi, I have a question about my recent order.', timestamp: '2023-06-01T10:05:00Z' },
  ],
  '2': [
    { id: '1', sender: 'Merchant', content: 'Your order has been shipped.', timestamp: '2023-06-02T09:00:00Z' },
    { id: '2', sender: 'User', content: 'Great, thank you! When can I expect delivery?', timestamp: '2023-06-02T09:15:00Z' },
  ],
  '3': [
    { id: '1', sender: 'User', content: 'Do you offer custom solutions?', timestamp: '2023-06-03T11:00:00Z' },
    { id: '2', sender: 'Merchant', content: 'Thank you for your inquiry. Yes, we do offer custom solutions.', timestamp: '2023-06-03T11:10:00Z' },
  ],
}

export default function MerchantDashboard() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedMerchant) {
      setMessages(mockMessages[selectedMerchant.id] || [])
    }
  }, [selectedMerchant])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedMerchant) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'User',
        content: newMessage,
        timestamp: new Date().toISOString()
      }
      setMessages(prevMessages => [...prevMessages, message])
      setNewMessage('')
      simulateMerchantResponse()
    }
  }

  const simulateMerchantResponse = () => {
    setIsTyping(true)
    setTimeout(() => {
      const merchantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'Merchant',
        content: 'Thank you for your message. I\'m looking into your inquiry now. Is there anything else I can help you with?',
        timestamp: new Date().toISOString()
      }
      setMessages(prevMessages => [...prevMessages, merchantMessage])
      setIsTyping(false)
    }, 3000) // Simulate a 3-second delay
  }

  return (
    <div className="flex h-screen px-8 bg-background">
      {/* Sidebar */}
      <div className="w-64 px-1 py-4 border-r">
        <div>
          <h2 className="text-lg font-semibold mb-4">Merchants</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {mockMerchants.map((merchant) => (
              <button
                key={merchant.id}
                className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                  selectedMerchant?.id === merchant.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedMerchant(merchant)}
              >
                <Avatar>
                  <AvatarImage src={merchant.avatar} alt={merchant.name} />
                  <AvatarFallback>{merchant.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium">{merchant.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{merchant.lastMessage}</p>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedMerchant ? (
          <Card className="flex-1 flex flex-col m-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedMerchant.avatar} alt={selectedMerchant.name} />
                  <AvatarFallback>{selectedMerchant.name[0]}</AvatarFallback>
                </Avatar>
                <span>{selectedMerchant.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${message.sender === 'User' ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
                    <p>{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">Merchant is typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a merchant to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}