'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '../../chat/chat-window'
import { Account, Merchant, ChatSession } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'

interface CustomerFlowProps {
  currentUser: Account
  selectedMerchant: Merchant | null
}

export function CustomerFlow({ currentUser, selectedMerchant }: CustomerFlowProps) {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)

  useEffect(() => {
    if (selectedMerchant) {
      fetchOrCreateChatSession()
    }
  }, [selectedMerchant])

  const fetchOrCreateChatSession = async () => {
    if (!selectedMerchant) return

    try {
      // Try to fetch existing chat session
      const response = await api.get<ChatSession[]>('chat-sessions', {
        customerId: currentUser.id,
        merchantId: selectedMerchant.id
      })

      let session: ChatSession | null = null

      if (response.data && response.data.length > 0) {
        session = mapBackendToFrontend<ChatSession>(response.data[0], 'chat-sessions')
      } else {
        // Create new chat session if none exists
        const newSessionResponse = await api.post<ChatSession>('chat-sessions', {
          customerId: currentUser.id,
          advisorId: selectedMerchant.id, // Initially set to merchant ID
        })
        if (newSessionResponse.data) {
          session = mapBackendToFrontend<ChatSession>(newSessionResponse.data, 'chat-sessions')
        }
      }

      setChatSession(session)
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