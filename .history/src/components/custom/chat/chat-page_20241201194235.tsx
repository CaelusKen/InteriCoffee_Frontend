'use client'

import { useState, useEffect } from 'react'
import { useAccessToken } from '@/hooks/use-access-token'
import { ChatWindow } from './chat-window'
import { MerchantSearch } from '../user/messages/merchant-search'
import { CustomerFlow } from '../user/messages/customer-chat-dashboard'
import { MerchantFlow } from '../sections/body/merchant/messages/merchant-chat-dashboard'
import { ChatSession, Account, Merchant } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useSession } from 'next-auth/react'
import { ApiResponse, PaginatedResponse } from '@/types/api'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info`)
}

const fetchChatSessions = async(merchantId: string, accessToken: string) : Promise<ApiResponse<PaginatedResponse<ChatSession>>> => {
    return api.getPaginated<ChatSession>(`chat-sessions`, undefined, accessToken)
}

const fetchChatSession = async(chatId: string, accessToken: string) : Promise<ApiResponse<ChatSession>> => {
    return api.getById<ChatSession>(`chat-sessions`, chatId, accessToken)
}

export function ChatPage()
 {
  const [chatsession, setChatSession] = useState<ChatSession | null>(null)
  const [currentUser, setCurrentUser] = useState<Account | null>(null)
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const { data: session } = useSession()
  const accessToken = useAccessToken()

  useEffect(() =>
 {
    if (accessToken && session) {
      fetchCurrentUser()
    }
  }, [accessToken])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchAccountByEmail(session?.user.email ?? '')
      if (response.data) {
        setCurrentUser(mapBackendToFrontend<Account>(response.data, 'account'))
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const handleMerchantSelect = (merchant: Merchant) => {
    setSelectedMerchant(merchant)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
      { currentUser.role === 'CUSTOMER' && (
        <MerchantSearch onSelect={handleMerchantSelect} />
      )}
      </div>
      <div className="w-2/3">
        {currentUser.role === 'CUSTOMER' ? (
          <CustomerFlow 
            currentUser={currentUser} 
            selectedMerchant={selectedMerchant} 
          />
        ) : (
          <MerchantFlow 
            currentUser={currentUser} 
            selectedMerchant={selectedMerchant} 
          />
        )}
      </div>
    </div>
  )
}