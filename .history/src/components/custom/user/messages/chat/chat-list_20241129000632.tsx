'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ref, onValue, off, push } from 'firebase/database'
import { db } from '@/service/firebase'
import { MerchantSearch } from './merchant-search'
import { Merchant } from '@/types/frontend/entities'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'

interface ChatSession {
  id: string
  customerId: string
  merchantId: string
  lastMessage: string
  updatedDate: string
}

export function ChatList() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const chatsRef = ref(db, 'chats')
    
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const sessionList = Object.entries(data).map(([id, session]: [string, any]) => ({
          id,
          customerId: session.customerId,
          merchantId: session.merchantId,
          lastMessage: session.messages[session.messages.length - 1]?.message || '',
          updatedDate: session['updated-date']
        }))
        setChatSessions(sessionList)
      }
    })

    return () => off(chatsRef)
  }, [])

  const handleMerchantSelect = (merchant: Merchant) => {
    if (!session?.user?.email) return

    const newSessionId = uuidv4()
    const newSession: ChatSession = {
      id: newSessionId,
      customerId: session.user.email,
      merchantId: merchant.id,
      lastMessage: '',
      updatedDate: new Date().toISOString()
    }

    const chatRef = ref(db, `chats/${newSessionId}`)
    push(chatRef, newSession)

    router.push(`/chat/${newSessionId}`)
  }

  return (
    <Card className="w-1/4 h-full overflow-y-auto border-r">
      <CardHeader>
        <CardTitle>Chat Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <MerchantSearch onMerchantSelect={handleMerchantSelect} />
        <div className="mt-4">
          {chatSessions.map((session) => (
            <Button
              key={session.id}
              variant="ghost"
              className="w-full justify-start text-left mb-2"
              onClick={() => router.push(`/chat/${session.id}`)}
            >
              <div>
                <div className="font-semibold">Merchant ID: {session.merchantId}</div>
                <div className="text-sm text-muted-foreground truncate">{session.lastMessage}</div>
                <div className="text-xs text-muted-foreground">{new Date(session.updatedDate).toLocaleString()}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}