'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { uploadFile, sendMessage, subscribeToChat, markMessageAsRead } from '@/lib/firebase-storage'
import { FirestoreMessage, FirestoreChatParticipant } from '@/types/firestore'
import { useToast } from '@/hooks/use-toast'

interface MerchantChatMainProps {
  chatId: string
  currentUser: FirestoreChatParticipant
  otherUser: FirestoreChatParticipant
}

const defaultMessages = [
  "Hello! How can I assist you today?",
  "Thank you for your interest in our products.",
  "Would you like to know more about our current promotions?",
  "Is there anything specific you're looking for?",
  "Please let me know if you have any questions about our products or services.",
]

export function MerchantChatMain({ chatId, currentUser, otherUser }: MerchantChatMainProps) {
  const [messages, setMessages] = useState<FirestoreMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = subscribeToChat(chatId, (updatedMessages) => {
      setMessages(updatedMessages)
      // Mark new messages as read
      updatedMessages
        .filter(msg => msg.senderId !== currentUser.id && msg.status !== 'read')
        .forEach(msg => markMessageAsRead(chatId, msg.id, currentUser.id))
    })

    return () => unsubscribe()
  }, [chatId, currentUser.id])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      await sendMessage(
        chatId,
        currentUser.id,
        content.trim(),
        'text'
      )
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const fileUrl = await uploadFile(file, chatId)
      const type = file.type.startsWith('image/') ? 'image' : 'video'
      await sendMessage(
        chatId,
        currentUser.id,
        file.name,
        type,
        fileUrl
      )
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4">
        <h2 className="font-semibold">Chat with {otherUser.name}</h2>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === currentUser.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.type === 'text' && <p>{message.content}</p>}
                {message.type === 'image' && message.fileUrl && (
                  <img
                    src={message.fileUrl}
                    alt={message.content}
                    className="max-w-full rounded"
                  />
                )}
                {message.type === 'video' && message.fileUrl && (
                  <video
                    src={message.fileUrl}
                    controls
                    className="max-w-full rounded"
                  />
                )}
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toDate().toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4 ">
        <div className="flex flex-wrap gap-2 mb-2">
          {defaultMessages.map((message, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(message)}
              disabled={isLoading}
            >
              {message}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,video/*"
            id="file-upload"
            aria-label="Attach file"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <label htmlFor="file-upload">
              <Paperclip className="h-5 w-5" />
            </label>
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(newMessage)
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSendMessage(newMessage)} 
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}