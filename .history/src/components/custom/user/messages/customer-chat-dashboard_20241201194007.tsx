'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '../../chat/chat-window'
import { Account, Merchant, ChatSession } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useAccessToken } from '@/hooks/use-access-token'
import { ApiResponse, PaginatedResponse } from '@/types/api'

interface CustomerFlowProps {
  currentUser: Account
  selectedMerchant: Merchant | null
}

const fetchCustomerChatSessions = async(accessToken: string): Promise<ApiResponse<PaginatedResponse<ChatSession>>> => {
    return api.getPaginated<ChatSession>('chat-sessions', undefined, accessToken)
}

export function CustomerFlow({ currentUser, selectedMerchant }: CustomerFlowProps) {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const accessToken = useAccessToken()

  useEffect(() => {
    if (selectedMerchant) {
      fetchOrCreateChatSession()
    }
  }, [selectedMerchant])

  const fetchOrCreateChatSession = async () => {
    if (!selectedMerchant) return

    try {
      // Fetch all chat sessions and filter client-side
      const response = await fetchCustomerChatSessions(accessToken ?? '')
      console.log(response);
      
      const sessions = response.data.items.map(session => 
        mapBackendToFrontend<ChatSession>(session, 'chat-sessions')
      )
      
      // Find existing session for this customer and merchant
      const existingSession = sessions.find(session => 
        session.customerId === currentUser.id && 
        session.advisorId === selectedMerchant.id
      )

      if (existingSession) {
        setChatSession(existingSession)
      } else {
        // Create new session if none exists
        const newSessionResponse = await api.post<ChatSession>('chat-sessions', {
          "customer-id": currentUser.id,
          "advisor-id": selectedMerchant.id,
          messages: []
        }, accessToken ?? '')
        
        if (newSessionResponse.data) {
          const newSession = mapBackendToFrontend<ChatSession>(newSessionResponse.data, 'chat-sessions')
          setChatSession(newSession)
        }
      }
    } catch (error) {
      console.error('Error fetching or creating chat session:', error)
    }
  }

  if (!selectedMerchant) {
    return <div className="p-4">Please select a merchant to start chatting.</div>
  }

  if (!chatSession) {
    return <div className="p-4">Loading chat session...</div>
  }

  return (
    <ChatWindow 
      session={chatSession}
      currentUserId={currentUser.id}
    />
  )
}