'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string) => void
}

export function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSend(value)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button type="submit" size="icon" disabled={isSubmitting}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}