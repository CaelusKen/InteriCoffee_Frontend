'use client'

import ChatTest from "@/components/custom/chat/test-chat"
import { Suspense } from "react"

export default function CustomerChatPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ChatTest />
      </Suspense>
    </div>
  )
}

