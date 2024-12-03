'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '@/components/custom/chat/chat-window'
import { Account, Merchant, ChatSession } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend, mapBackendListToFrontend } from '@/lib/entity-handling/handler'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface MerchantFlowProps {
  currentUser: Account
  selectedMerchant: Merchant | null
}

export function MerchantFlow({ currentUser, selectedMerchant }: MerchantFlowProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [consultants, setConsultants] = useState<Account[]>([])
  const [selectedConsultant, setSelectedConsultant] = useState<string>('')
  const [defaultMessages, setDefaultMessages] = useState<string[]>([])
  const [newDefaultMessage, setNewDefaultMessage] = useState('')

  useEffect(() => {
    if (selectedMerchant) {
      fetchChatSessions()
      fetchConsultants()
      fetchDefaultMessages()
    }
  }, [selectedMerchant])

  const fetchChatSessions = async () => {
    if (!selectedMerchant) return

    try {
      const response = await api.get<ChatSession>(`chat-sessions/merchant/${selectedMerchant.id}`)
      const sessions = mapBackendListToFrontend<ChatSession>(response.data, 'chat-sessions')
      setChatSessions(sessions.items)
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    }
  }

  const fetchConsultants = async () => {
    if (!selectedMerchant) return

    try {
      const response = await api.getPaginated<Account>('accounts', {
        merchantId: selectedMerchant.id,
        role: 'CONSULTANT'
      })
      const consultantAccounts = mapBackendListToFrontend<Account>(response.data, 'accounts')
      setConsultants(consultantAccounts.items)
    } catch (error) {
      console.error('Error fetching consultants:', error)
    }
  }

  const fetchDefaultMessages = async () => {
    if (!selectedMerchant) return

    try {
      const response = await api.get<string[]>(`merchants/${selectedMerchant.id}/default-messages`)
      if (response.data) {
        setDefaultMessages(response.data)
      }
    } catch (error) {
      console.error('Error fetching default messages:', error)
    }
  }

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session)
  }

  const handleConsultantAssign = async () => {
    if (!selectedSession || !selectedConsultant) return

    try {
      const response = await api.patch<ChatSession>(`chat-sessions/${selectedSession.id}`, {
        advisorId: selectedConsultant
      })
      if (response.data) {
        const updatedSession = mapBackendToFrontend<ChatSession>(response.data, 'chat-sessions')
        setSelectedSession(updatedSession)
        setChatSessions(chatSessions.map(s => s.id === updatedSession.id ? updatedSession : s))
      }
    } catch (error) {
      console.error('Error assigning consultant:', error)
    }
  }

  const handleAddDefaultMessage = async () => {
    if (!selectedMerchant || !newDefaultMessage) return

    try {
      const response = await api.post<string[]>(`merchants/${selectedMerchant.id}/default-messages`, {
        message: newDefaultMessage
      })
      if (response.data) {
        setDefaultMessages(response.data)
        setNewDefaultMessage('')
      }
    } catch (error) {
      console.error('Error adding default message:', error)
    }
  }

  if (!selectedMerchant) {
    return <div className="p-4">Please select a merchant to manage chats.</div>
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Chat Sessions</h2>
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
      </div>
      <div className="w-2/3 p-4">
        {selectedSession ? (
          <>
            <div className="mb-4 flex items-center">
              <Select
                value={selectedConsultant}
                onValueChange={setSelectedConsultant}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Assign consultant" />
                </SelectTrigger>
                <SelectContent>
                  {consultants.map((consultant) => (
                    <SelectItem key={consultant.id} value={consultant.id}>
                      {consultant.userName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleConsultantAssign} className="ml-2">
                Assign
              </Button>
            </div>
            <ChatWindow 
              session={selectedSession}
              currentUserId={currentUser.id}
            />
          </>
        ) : (
          <div>Select a chat session to view</div>
        )}
      </div>
      <div className="w-1/3 border-l p-4">
        <h2 className="text-lg font-semibold mb-4">Default Messages</h2>
        <ul className="space-y-2 mb-4">
          {defaultMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        {defaultMessages.length < 5 && (
          <div className="flex">
            <Input
              type="text"
              value={newDefaultMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDefaultMessage(e.target.value)}
              placeholder="New default message"
              className="flex-1 mr-2"
            />
            <Button onClick={handleAddDefaultMessage}>Add</Button>
          </div>
        )}
      </div>
    </div>
  )
}