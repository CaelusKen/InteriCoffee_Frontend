import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: string
  sender: string
  timestamp: Date
  isCurrentUser: boolean
}

export function ChatMessage({ message, sender, timestamp, isCurrentUser }: ChatMessageProps) {
  return (
    <div className={`flex items-start gap-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      <Avatar>
        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
        <AvatarFallback>{sender[0]}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col gap-1 ${isCurrentUser ? 'items-end' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{sender}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className={`rounded-lg px-3 py-2 text-sm ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          {message}
        </div>
      </div>
    </div>
  )
}