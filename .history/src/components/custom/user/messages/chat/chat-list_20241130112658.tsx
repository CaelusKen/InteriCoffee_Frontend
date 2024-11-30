'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { firebaseChat, ChatSession } from '@/lib/firebase-chat'
import { MerchantSearch } from './merchant-search'
import { Merchant } from '@/types/frontend/entities'
import { useSession } from 'next-auth/react'

export function ChatList() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.email) return

    console.log('Setting up chat session listener')
    setIsLoading(true);
    const unsubscribe = firebaseChat.listenToSessions(session.user.email, (sessions) => {
      console.log('Received chat sessions:', sessions)
      setChatSessions(sessions)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [session])

  const handleMerchantSelect = async (merchant: Merchant) => {
    if (!session?.user?.email) {
      console.error('No user session found')
      return
    }

    setIsCreatingSession(true)
    try {
      console.log('Creating new chat session with merchant:', merchant)
      const sessionId = await firebaseChat.createOrUpdateSession(
        session.user.email,
        merchant.id,
        `Chat started with ${merchant.name}`
      )
      console.log('New chat session created:', sessionId)
      router.push(`/customer/messages/${sessionId}`)
    } catch (error) {
      console.error('Error creating chat session:', error)
    } finally {
      setIsCreatingSession(false)
    }
  }

  return (
    <Card className="w-full md:w-1/4 h-full overflow-y-auto border-r">
      <CardHeader>
        <CardTitle>Chat Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <MerchantSearch onMerchantSelect={handleMerchantSelect} isCreatingSession={isCreatingSession} />
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading sessions...</div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center text-muted-foreground">No active chat sessions</div>
          ) : (
            chatSessions.map((chatSession) => (
              <Button
                key={chatSession.id}
                variant="ghost"
                className="w-full justify-start text-left mb-2"
                onClick={() => router.push(`/customer/messages/${chatSession.id}`)}
              >
                <div>
                  <div className="font-semibold">Participant: {chatSession.participantId}</div>
                  <div className="text-sm text-muted-foreground truncate">{chatSession.lastMessage}</div>
                  <div className="text-xs text-muted-foreground">{new Date(chatSession.updatedAt).toLocaleString()}</div>
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}