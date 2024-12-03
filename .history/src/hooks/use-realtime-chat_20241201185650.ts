'use client'

import { useEffect, useState, useCallback } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { realtimeDb } from '@/service/firebase'
import { ChatSession, Message } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend, mapBackendListToFrontend } from '@/lib/entity-handling/handler'
import { useAccessToken } from './use-access-token'

export function useRealtimeChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const accessToken = useAccessToken()

  const fetchInitialMessages = useCallback(async () => {
    try {
      const response = await api.getById<ChatSession>('chat-sessions', sessionId)
      if (response.data) {
        const chatSession = mapBackendToFrontend<ChatSession>(response.data, 'chat-sessions')
        setMessages(chatSession.messages)
      }
    } catch (err) {
      setError('Failed to fetch initial messages')
      console.error('Error fetching messages:', err)
    }
  }, [sessionId])

  useEffect(() => {
    const chatRef = ref(realtimeDb, `chats/${sessionId}/messages`)
    
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          sender: value.sender,
          message: value.message,
          timeStamp: new Date(value.timeStamp),
        }))
        setMessages(messageList)
      }
      setIsLoading(false)
    }, (error) => {
      setError('Failed to connect to real-time updates')
      console.error('Error connecting to Firebase:', error)
      setIsLoading(false)
    })

    fetchInitialMessages()

    return () => {
      unsubscribe()
    }
  }, [sessionId, fetchInitialMessages])

  const sendMessage = async (content: string, sender: string) => {
    try {
      // Send to REST API
      const apiResponse = await api.post<Message>(`chat-sessions/${sessionId}/messages`, {
        message: content,
        sender,
        'time-stamp': new Date().toISOString(),
      }, accessToken ?? '')

      if (!apiResponse.data) {
        throw new Error('Failed to send message to API')
      }

      // Send to Firebase Realtime Database
      const chatRef = ref(realtimeDb, `chats/${sessionId}/messages`)
      const newMessageRef = push(chatRef)
      await set(newMessageRef, {
        message: content,
        sender,
        timeStamp: new Date().toISOString(),
      })

    } catch (err) {
      setError('Failed to send message')
      console.error('Error sending message:', err)
      throw err
    }
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage
  }
}