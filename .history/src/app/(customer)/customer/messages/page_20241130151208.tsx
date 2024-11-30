import { Suspense } from 'react'

export default function ChatPage() {
  return (
    <div className="flex gap-4 h-full">
      <Suspense fallback={<div>Loading chats...</div>}>
        Chat List
      </Suspense>
      <Suspense fallback={<div>Loading chat...</div>}>
        Chat Window
      </Suspense>
    </div>
  )
}

