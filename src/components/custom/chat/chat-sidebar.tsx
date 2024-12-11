'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FirestoreChat, FirestoreChatParticipant } from '@/types/firestore'

interface ChatSidebarProps {
  chats: FirestoreChat[]
  selectedChat: FirestoreChat | null
  currentUserId: string
  onSelectChat: (chat: FirestoreChat) => void
  onNewChat: () => void
  isLoading: boolean;
}

export function ChatSidebar({ chats, selectedChat, currentUserId, onSelectChat, onNewChat, isLoading }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat => 
    chat.participants.some(participant => 
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const getOtherParticipant = (chat: FirestoreChat): FirestoreChatParticipant => {
    return chat.participants.find(p => p.id !== currentUserId) || chat.participants[0]
  }

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onNewChat} className="ml-2">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
        {isLoading ? (
          <div className="p-4 text-center">
            <p>Loading chats...</p>
          </div>
        ) : (
          <>
            {filteredChats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat)
              return (
                <button
                  key={chat.id}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-accent' : 'hover:bg-accent'
                  }`}
                  onClick={() => onSelectChat(chat)}
                >
                  <Avatar>
                    <AvatarImage src={otherParticipant.avatar} />
                    <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{otherParticipant.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </div>
                  </div>
                </button>
              )
            })}
          </>
        )}
        </div>
      </ScrollArea>
    </div>
  )
}