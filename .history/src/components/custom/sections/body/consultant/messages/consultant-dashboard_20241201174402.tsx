'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '@/components/custom/chat/chat-window'
import { Account, ChatSession } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ConsultantFlowProps {
  currentUser: Account
}

export function ConsultantFlow({ currentUser }: ConsultantFlowProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)

  useEffect(() => {
    fetchAssignedChatSessions()
  }, [])

  const fetchAssignedChatSessions = async () => {
    try {
      // Use the manager endpoint to get all sessions
      const response = await api.get<ChatSession[]>('chat-sessions/manager')
      const allSessions = response.data.map(session => 
        mapBackendToFrontend<ChatSession>(session, 'chat-sessions')
      )
      
      // Filter for sessions assigned to this consultant
      const assignedSessions = allSessions.filter(session => 
        session.advisorId === currentUser.id
      )
      
      setChatSessions(assignedSessions)
    } catch (error) {
      console.error('Error fetching assigned chat sessions:', error)
    }
  }

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session)
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Assigned Chat Sessions</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <ul className="space-y-2">
            {chatSessions.map((session) => (
              <li key={session.id}>
                <Button
                  variant="ghost"
                  className="w-full text-left"
                  onClick={() => handleSessionSelect(session)}
                >
                  Chat with {session.customerId}
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <div className="w-2/3 p-4">
        {selectedSession ? (
          <ChatWindow 
            session={selectedSession}
            currentUserId={currentUser.id}
          />
        ) : (
          <div>Select a chat session to view</div>
        )}
      </div>
    </div>
  )
}