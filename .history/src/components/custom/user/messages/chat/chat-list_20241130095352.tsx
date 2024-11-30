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
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.email) return

    const unsubscribe = firebaseChat.listenToSessions(session.user.email, (sessions) => {
      setChatSessions(sessions)
    })

    return () => unsubscribe()
  }, [session])

  const handleMerchantSelect = async (merchant: Merchant) => {
    if (!session?.user?.email) return

    const sessionId = await firebaseChat.createOrUpdateSession(
      session.user.email,
      merchant.id,
      `Chat started with ${merchant.name}`
    )

    router.push(`/customer/messages/${sessionId}`)
  }

  return (
    <Card className="w-full md:w-1/4 h-full overflow-y-auto border-r">
      <CardHeader>
        <CardTitle>Chat Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <MerchantSearch onMerchantSelect={handleMerchantSelect} />
        <div className="mt-4">
          {chatSessions.map((chatSession) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}