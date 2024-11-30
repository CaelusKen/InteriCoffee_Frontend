
import ConsultantDashboard from '@/components/custom/sections/body/consultant/messages/consultant-dashboard'
import { Suspense } from 'react'

export default function ChatPage() {
  return (
    <div className="flex gap-4 h-full">
      <Suspense fallback={<div>Loading chats...</div>}>
        <ConsultantDashboard/>
      </Suspense>
    </div>
  )
}

