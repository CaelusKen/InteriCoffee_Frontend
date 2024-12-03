import { useState } from 'react'
import ChatList from './chat-list'
import ChatView from './chat-view'

interface ChatComponentProps {
  role: string;
  userId: string;
}

export default function ChatComponent({ role, userId }: ChatComponentProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  return (
    <div className="flex h-screen">
      <ChatList role={role} userId={userId} onSelectChat={setSelectedChatId} />
      {selectedChatId ? (
        <div className="flex-grow">
          <ChatView role={role} userId={userId} chatId={selectedChatId} />
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}