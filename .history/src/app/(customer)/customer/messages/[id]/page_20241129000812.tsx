import { Suspense } from 'react'
import { ChatList } from '@/components/custom/user/messages/chat/chat-list'
import { ChatWindow } from '@/components/custom/user/messages/chat/chat-window'

export default function ChatSessionPage() {
  return (
    <div className="flex h-full">
      <Suspense fallback={<div>Loading chats...</div>}>
        <ChatList />
      </Suspense>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatWindow />
      </Suspense>
    </div>
  )
}

