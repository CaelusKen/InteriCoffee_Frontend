import ChatList from '@/components/custom/user/messages/chat-list'
import ChatView from '@/components/custom/user/messages/chat-view'
import { Suspense } from 'react'

export default function ChatPage() {
  return (
    <div className="flex gap-4 h-full">
      <Suspense fallback={<div>Loading chats...</div>}>
        <ChatList/>
      </Suspense>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatView/>
      </Suspense>
    </div>
  )
}

