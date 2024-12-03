'use client'

import { useEffect, useState } from 'react'
import { ChatWindow } from './chat-window'
import { ChatSession } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'

export default function ChatPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<ChatSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await api.getById<ChatSession>('chat-sessions', params.id)
        if (response.data) {
          const chatSession = mapBackendToFrontend<ChatSession>(response.data, 'chat-sessions')
          setSession(chatSession)
        }
      } catch (err) {
        setError('Failed to fetch chat session')
        console.error('Error fetching session:', err)
      }
    }

    fetchSession()
  }, [params.id])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <ChatWindow 
        session={session}
        currentUserId="current-user-id" // Replace with actual user ID from your auth system
      />
    </div>
  )
}