'use client'

import ChatComponent from '@/components/custom/chat/chat'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { api } from '@/service/api'
import { Account } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Suspense } from 'react'

export default function ChatPage() {
  const { data: session } = useSession()

  const accountQuery = useQuery({
    queryKey: ['account', session?.user.email],
    queryFn: () => api.get<Account>(`accounts/${session?.user.email}/info`),
    enabled:!!session?.user.email,
  })

  const account = accountQuery.data

  return (
    <div>
      <Suspense fallback={<div>Loading chats...</div>}>
        <ChatComponent role={session?.user.role?.toLowerCase() ?? ''} userId={account ? account.data.id : ''}/>
      </Suspense>
    </div>
  )
}