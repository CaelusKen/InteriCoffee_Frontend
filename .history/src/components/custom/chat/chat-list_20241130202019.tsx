import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, MessageSquare, Search, User } from 'lucide-react'
import { firebaseChat } from '@/lib/firebase-chat'
import { ChatSession } from '@/types/frontend/entities'

interface ChatListProps {
    role: string;
    userId: string;
    onSelectChat: (chatId: string) => void
}

export default function ChatList({ role, userId, onSelectChat }: ChatListProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = firebaseChat.listenToSessions(userId, (updatedSessions) => {
      setSessions(updatedSessions)
      setIsLoading(false)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [userId])

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId)
    if (onSelectChat) onSelectChat(chatId)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-1/4 pl-10 bg-primary-100 dark:bg-primary-900 p-4 overflow-y-auto">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-2 pl-10 rounded-lg bg-baseWhite dark:bg-neutrals-800 text-baseBlack dark:text-baseWhite"
          />
          <Search className="absolute left-3 top-2.5 text-neutrals-500" size={18} />
        </div>
      </div>
      {sessions.map((session) => (
        <motion.div
          key={session.id}
          className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
            selectedChat === session.id
              ? 'bg-primary-300 dark:bg-primary-700'
              : 'hover:bg-primary-200 dark:hover:bg-primary-800'
          }`}
          onClick={() => handleChatSelect(session.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Coffee className="mr-3 text-primary-500" />
          <div className="flex-grow">
            <h3 className="font-semibold text-baseBlack dark:text-baseWhite">{session.advisorId}</h3>
            <p className="text-sm text-neutrals-600 dark:text-neutrals-400">{session.lastMessage}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}