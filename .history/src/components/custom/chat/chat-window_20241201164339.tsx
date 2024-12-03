'use client'

import { useState } from 'react'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { ChatSession } from '@/types/frontend/entities'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ChatWindowProps {
  session: ChatSession
  currentUserId: string
}

export function ChatWindow({ session, currentUserId }: ChatWindowProps) {
  const { messages, isLoading, error, sendMessage } = useRealtimeChat(session.id)
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return
    
    try {
      await sendMessage(content, currentUserId)
      setInputValue('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Retry Connection
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          Chat with {session.customerId === currentUserId ? 'Advisor' : 'Customer'}
        </h2>
      </div>
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId}
      />
      
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
      />
    </div>
  )
}