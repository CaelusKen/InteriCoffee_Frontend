'use client'

import React, { useState, useEffect } from 'react'
import { useSocket } from '@/hooks/use-socket'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChatRoom {
  id: string
  name: string
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
  }
  timestamp: string
  roomId: string
}

export default function ChatTest() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const { data: session } = useSession()
  const socket = useSocket('http://localhost:3000', '/api/messages/socketio')

  useEffect(() => {
    fetchChatRooms()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message])
      })

      return () => {
        socket.off('receive-message')
      }
    }
  }, [socket])

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom)
    }
  }, [selectedRoom])

  const fetchChatRooms = async () => {
    try {
      const response = await fetch('/api/messages/chat-rooms')
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms')
      }
      const rooms = await response.json()
      setChatRooms(rooms)
    } catch (error) {
      console.error('Error fetching chat rooms:', error)
    }
  }

  const fetchMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/messages/${roomId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const fetchedMessages = await response.json()
      setMessages(fetchedMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoom || !session?.user || inputMessage.trim() === '') return

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: inputMessage,
          roomId: selectedRoom,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setInputMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Select Chat Room:</h3>
            <div className="flex flex-wrap gap-2">
              {chatRooms.map((room) => (
                <Button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  variant={selectedRoom === room.id ? 'default' : 'outline'}
                >
                  {room.name}
                </Button>
              ))}
            </div>
          </div>

          {selectedRoom && (
            <>
              <div className="h-64 overflow-y-auto border rounded p-2">
                {messages.map((message) => (
                  <div key={message.id} className="mb-2">
                    <span className="font-semibold">{message.sender.name}: </span>
                    <span>{message.content}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button type="submit">Send</Button>
              </form>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}