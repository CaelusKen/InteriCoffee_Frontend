'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Merchant, ChatSession, Account } from '@/types/frontend/entities'
import { searchMerchants } from '@/utils/merchant-search'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useSession } from 'next-auth/react'
import { ApiResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'

interface MerchantSearchProps {
  onSelect: (merchant: Merchant, chatSession: ChatSession) => void
}

const fetchAccoutByEmail = async(email: string): Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info`)
}

export function MerchantSearch({ onSelect }: MerchantSearchProps) {
  const [query, setQuery] = useState('')
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    fetchChatSessions()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetchMerchants()
      } else {
        setMerchants([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const fetchChatSessions = async () => {
    try {
      const response = await api.get<ChatSession[]>('chat-sessions')
      const sessions = response.data.map(session => 
        mapBackendToFrontend<ChatSession>(session, 'chat-sessions')
      )
      setChatSessions(sessions)
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    }
  }

  const fetchMerchants = async () => {
    setIsLoading(true)
    try {
      const result = await searchMerchants(query)
      setMerchants(result.items)
    } catch (error) {
      console.error('Error searching merchants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const accountQuery = useQuery({
    queryKey: ['account', session?.user?.email],
    queryFn: () => fetchAccoutByEmail(session?.user?.email ?? ''),
    enabled:!!session?.user?.email
  })

  const account = accountQuery.data?.data

  const handleMerchantSelect = async (merchant: Merchant) => {
    if (!account?.id) {
      console.error('User ID not found')
      return
    }

    const existingSession = chatSessions.find(
      cs => cs.customerId === account?.id && cs.advisorId === merchant.id
    )

    if (existingSession) {
      onSelect(merchant, existingSession)
    } else {
      try {
        const newSessionResponse = await api.post<ChatSession>('chat-sessions', {
          customerId: account?.id,
          advisorId: merchant.id,
          messages: []
        })
        
        if (newSessionResponse.data) {
          const newSession = mapBackendToFrontend<ChatSession>(newSessionResponse.data, 'chat-sessions')
          setChatSessions([...chatSessions, newSession])
          onSelect(merchant, newSession)
        }
      } catch (error) {
        console.error('Error creating new chat session:', error)
      }
    }
  }

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Search merchants..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {merchants?.map((merchant) => (
            <li key={merchant.id}>
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => handleMerchantSelect(merchant)}
              >
                {merchant.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}