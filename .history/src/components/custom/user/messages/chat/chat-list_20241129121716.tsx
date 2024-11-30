'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ref, onValue, off, set } from 'firebase/database'
import { db } from '@/service/firebase'
import { MerchantSearch } from './merchant-search'
import { Merchant, ChatSession } from '@/types/frontend/entities'
import { useSession } from 'next-auth/react'
import { v4 as uuidv4 } from 'uuid'

interface ChatSessionListItem {
  id: string
  customerId: string
  merchantId: string
  consultantId?: string
  lastMessage: string
  updatedDate: string
}

export default function ChatList() {
  const [chatSessions, setChatSessions] = useState<ChatSessionListItem[]>([])
  const router = useRouter()
  const { data: session } = useSession()
  const userType = session?.user.role

  useEffect(() => {
    if (!session?.user?.email) return

    const chatsRef = ref(db, 'chats')
    
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const sessionList = Object.entries(data)
          .map(([id, session]: [string, any]) => ({
            id,
            customerId: session.customerId,
            merchantId: session.merchantId,
            consultantId: session.consultantId,
            lastMessage: session.lastMessage || '',
            updatedDate: session.updatedDate
          }))
          .filter(chatSession => {
            switch (userType) {
              case 'customer':
                return chatSession.customerId === session?.user?.email
              case 'merchant':
                return chatSession.merchantId === session?.user?.email
              case 'consultant':
                return chatSession.consultantId === session?.user?.email
              default:
                return false
            }
          })
        setChatSessions(sessionList)
      }
    })

    return () => off(chatsRef)
  }, [session, userType])

  const handleMerchantSelect = async (merchant: Merchant) => {
    console.log("Handling Merchant select")
    if (!session?.user?.email) return

    const newSessionId = uuidv4()
    const newSession: ChatSession = {
      id: newSessionId,
      customerId: session.user.email,
      advisorId: merchant.id,
      messages: [],
      createdDate: new Date(),
      updatedDate: new Date(),
      lastMessage: ''
    }

    console.log(newSession)

    const chatRef = ref(db, `chats/${newSessionId}`)
    await set(chatRef, newSession)

    router.push(`/customer/messages/${newSessionId}`)
  }

  return (
    <Card className="w-1/4 h-full overflow-y-auto border-r">
      <CardHeader>
        <CardTitle>Chat Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {userType?.toLowerCase() === 'customer' && <MerchantSearch onMerchantSelect={handleMerchantSelect} />}
        <div className="mt-4">
          {chatSessions.map((session) => (
            <Button
              key={session.id}
              variant="ghost"
              className="w-full justify-start text-left mb-2"
              onClick={() => router.push(`/${userType}/messages/${session.id}`)}
            >
              <div>
                <div className="font-semibold">
                  {userType === 'customer' ? `Merchant: ${session.merchantId}` :
                   userType === 'merchant' ? `Customer: ${session.customerId}` :
                   `Customer: ${session.customerId}, Merchant: ${session.merchantId}`}
                </div>
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