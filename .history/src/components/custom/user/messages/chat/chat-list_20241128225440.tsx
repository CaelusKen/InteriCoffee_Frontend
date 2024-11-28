'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ref, onValue, off } from 'firebase/database'
import { db } from '@/service/firebase'

interface ChatSession {
  id: string
  customerId: string
  advisorId: string
  lastMessage: string
  updatedDate: string
}

export function ChatList() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const router = useRouter()

  useEffect(() => {
    const chatsRef = ref(db, 'chats')
    
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const sessionList = Object.entries(data).map(([id, session]: [string, any]) => ({
          id,
          customerId: session.customerId,
          advisorId: session.advisorId,
          lastMessage: session.messages[session.messages.length - 1]?.message || '',
          updatedDate: session['updated-date']
        }))
        setChatSessions(sessionList)
      }
    })

    return () => off(chatsRef)
  }, [])

  return (
    <Card className="w-1/4 h-full overflow-y-auto border-r">
      <CardHeader>
        <CardTitle>Chat Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {chatSessions.map((session) => (
          <Button
            key={session.id}
            variant="ghost"
            className="w-full justify-start text-left mb-2"
            onClick={() => router.push(`/chat/${session.id}`)}
          >
            <div>
              <div className="font-semibold">Customer: {session.customerId}</div>
              <div className="text-sm text-muted-foreground truncate">{session.lastMessage}</div>
              <div className="text-xs text-muted-foreground">{new Date(session.updatedDate).toLocaleString()}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

