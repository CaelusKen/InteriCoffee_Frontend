'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import io, { Socket } from 'socket.io-client'
import { ChatRoom, Message } from "@/types/chat"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiResponse } from '@/types/api'
import { api } from '@/service/api'
import { Account } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'

let socket: Socket | null = null

const fetchAccountByEmail = async(email: string): Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info`)
}

export default function ChatDashboard() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const { data: session } = useSession()

  const accountQuery = useQuery({
    queryKey: ['account', session?.user.email],
    queryFn: () => fetchAccountByEmail(session?.user.email ?? ''),
  })

  const account = accountQuery.data?.data as Account

  useEffect(() => {
    socketInitializer()
    fetchChatRooms()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  const socketInitializer = async () => {
    await fetch('/api/socketio')
    socket = io('http://localhost:3000', {
      path: '/api/messages/socketio',
    })

    socket.on('connect', () => {
      console.log('Connected to Socket.IO')
    })

    socket.on('receive-message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message])
      updateLastMessage(message)
    })
  }

  const fetchChatRooms = async () => {
    // This is a mock function. In a real application, you would fetch this data from your API.
    const mockRooms: ChatRoom[] = [
      { id: '1', name: 'General' },
      { id: '2', name: 'Random' },
      { id: '3', name: 'Tech Talk' },
    ]
    setChatRooms(mockRooms)
  }

  const joinRoom = (roomId: string) => {
    if (socket) {
      socket.emit('join-room', roomId)
      setSelectedRoom(roomId)
      fetchMessages(roomId)
    }
  }

  const fetchMessages = async (roomId: string) => {
    // This is a mock function. In a real application, you would fetch messages from your API.
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Welcome to the chat!',
        sender: { id: 'system', name: 'System' },
        timestamp: Date.now(),
        roomId,
      },
    ]
    setMessages(mockMessages)
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === '' || !selectedRoom || !session?.user) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: {
        id: account?.id as string,
        name: session.user.name as string,
      },
      timestamp: Date.now(),
      roomId: selectedRoom,
    }

    if (socket) {
      socket.emit('send-message', newMessage)
    }

    setInputMessage('')
    setMessages((prevMessages) => [...prevMessages, newMessage])
    updateLastMessage(newMessage)
  }

  const updateLastMessage = (message: Message) => {
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === message.roomId ? { ...room, lastMessage: message } : room
      )
    )
  }

  return (
    <div className="flex h-[calc(100vh-100px)]">
      <Card className="w-1/4 mr-4">
        <CardHeader>
          <CardTitle>Chat Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            {chatRooms.map((room) => (
              <Button
                key={room.id}
                onClick={() => joinRoom(room.id)}
                variant={selectedRoom === room.id ? 'default' : 'outline'}
                className="w-full mb-2 justify-start"
              >
                <div>
                  <div>{room.name}</div>
                  {room.lastMessage && (
                    <div className="text-sm text-gray-500 truncate">
                      {room.lastMessage.content}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>
            {selectedRoom
              ? chatRooms.find((room) => room.id === selectedRoom)?.name
              : 'Select a room'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.sender.id === account?.id
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                <span className="font-bold">{message.sender.name}: </span>
                <span>{message.content}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={sendMessage} className="w-full flex">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}