import { Suspense } from 'react'
import ChatList from '@/components/custom/user/messages/chat-list'
import ChatView from '@/components/custom/user/messages/chat-view'

export default function ChatSessionPage({ params }: { params: { sessionId: string } }) {
  return (
    <div className="flex h-full">
      <Suspense fallback={<div>Loading chats...</div>}>
        <ChatList/>
      </Suspense>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatView/>
      </Suspense>
    </div>
  )
}

