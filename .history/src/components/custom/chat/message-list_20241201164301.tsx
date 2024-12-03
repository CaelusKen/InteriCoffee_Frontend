import { Message } from '@/types/frontend/entities'
import { format } from 'date-fns'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.sender === currentUserId
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            <p className="break-words">{message.message}</p>
            <span className="text-xs opacity-70 block mt-1">
              {format(new Date(message.timeStamp), 'HH:mm')}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}