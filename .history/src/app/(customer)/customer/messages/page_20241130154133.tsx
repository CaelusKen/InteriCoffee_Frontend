import CustomerDashboard from '@/components/custom/user/messages/customer-chat-dashboard'
import { Suspense } from 'react'

export default function ChatPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading chats...</div>}>
        <CustomerDashboard/>
      </Suspense>
    </div>
  )
}

