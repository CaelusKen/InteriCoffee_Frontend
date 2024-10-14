"use client"

import React, { useState } from 'react'
import { format } from 'date-fns'
import { MoreVertical, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  id: number
  sender: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unread: boolean
}

interface Consultant {
  id: number
  name: string
}

// Mock data for messages and consultants
const messages: Message[] = [
  { id: 1, sender: "Emma Thompson", avatar: "https://placeholder.co/40", lastMessage: "Hello, I have a question about my order.", timestamp: new Date(2023, 5, 20, 14, 30), unread: true },
  { id: 2, sender: "Liam Wilson", avatar: "https://placeholder.co/40", lastMessage: "Thank you for your help!", timestamp: new Date(2023, 5, 19, 10, 15), unread: false },
  { id: 3, sender: "Sophia Chen", avatar: "https://placeholder.co/40", lastMessage: "Is the blue dress available in size M?", timestamp: new Date(2023, 5, 18, 16, 45), unread: true },
]

const consultants: Consultant[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Carol Williams" },
]

export default function MessagePage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
  }

  const handleReply = () => {
    console.log("Replying with:", replyText)
    setReplyText("")
  }

  const handleAssignConsultant = (consultantId: string) => {
    if (selectedMessage) {
      console.log(`Assigning consultant ${consultantId} to message ${selectedMessage.id}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-center space-x-4 p-3 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <Avatar>
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{message.sender}</p>
                    <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      {format(message.timestamp, 'MMM d, HH:mm')}
                    </span>
                    {message.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Message Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={selectedMessage.avatar} alt={selectedMessage.sender} />
                      <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedMessage.sender}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedMessage.timestamp, 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-white text-black'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='cursor-pointer hover:bg-gray-300'>Mark as unread</DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer hover:bg-gray-300'>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-gray-300">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p>{selectedMessage.lastMessage}</p>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button onClick={handleReply}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Select onValueChange={handleAssignConsultant}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Assign consultant" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultants.map((consultant) => (
                        <SelectItem key={consultant.id} value={consultant.id.toString()}>
                          {consultant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Assign</Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Select a message to view</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}