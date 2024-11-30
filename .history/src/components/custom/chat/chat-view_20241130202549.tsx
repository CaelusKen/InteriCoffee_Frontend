import { useState, useEffect } from 'react'
import { firebaseChat } from '@/lib/firebase-chat'
import { Message as ChatMessage } from '@/types/frontend/entities'

interface ChatViewProps {
    role: string;
    userId: string;
    chatId: string;
}

export default function ChatView({ role, userId, chatId }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (chatId) {
      const unsubscribe = firebaseChat.listenToMessages(userId, chatId, (updatedMessages) => {
        setMessages(updatedMessages)
        setIsLoading(false)
      })

      return () => {
        if (unsubscribe) unsubscribe()
      }
    }
  }, [userId, chatId])

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId) {
      try {
        await firebaseChat.sendMessage(userId, chatId, newMessage)
        setNewMessage('')
      } catch (err) {
        setError('Failed to send message')
      }
    }
  }

  if (isLoading) return <div>Loading messages...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.sender === userId ? 'text-right' : 'text-left'}`}>
            <span className="inline-block p-2 rounded-lg bg-primary-200 dark:bg-primary-700">
              {message.message}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-neutrals-200 dark:border-neutrals-700">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 rounded-l-lg border border-neutrals-300 dark:border-neutrals-600"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-r-lg bg-primary-500 text-baseWhite"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}