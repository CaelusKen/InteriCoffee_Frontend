'use client'

import { useAccessToken } from '@/hooks/use-access-token'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, ChatSession } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, Coffee, MoreVertical } from 'lucide-react'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info`)
}

const fetchAccountById = async(id: string, accessToken: string) : Promise<ApiResponse<Account>> => {
  return api.getById<Account>(`accounts`, id, accessToken)
}

const fetchChatSessions = async(accessToken: string): Promise<ApiResponse<PaginatedResponse<ChatSession>>> => {
    return api.getPaginated<ChatSession>(`chat-sessions`, undefined, accessToken)
}

const fetchChatSessionByMerchantId = async(merchantId: string, accessToken: string): Promise<ApiResponse<ChatSession[]>> => {
    return api.get<ChatSession[]>(`chat-sessions/merchant/${ merchantId }`, undefined , accessToken)
  }

export default function MessengerDashboard() {
    const { data: session } = useSession()
    const accessToken = useAccessToken()

    const accountQuery = useQuery({
        queryKey: ['accountByEmail', session?.user?.email],
        queryFn: () => fetchAccountByEmail(session?.user?.email ?? ''),
        enabled: !!session?.user?.email,
    })

    
    const account = accountQuery.data?.data ? mapBackendToFrontend<Account>(accountQuery.data.data, 'account') : null
    const chatSessionQuery = useQuery({
        queryKey: ['chatSessions'],
        queryFn: () => fetchChatSessionByMerchantId(account?.merchantId ?? '', accessToken ?? ''),
        enabled: !!accessToken,
    })

    const formatDate = (date: Date | string ) => {
      const d = new Date(date)
      return d instanceof Date && !isNaN(d.getTime()) ? d.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      }) : "Invalid Date"
    }

    //This is a list of chat sessions
    const chatSessions: Array<ChatSession> = chatSessionQuery.data?.data ?? []

    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
    const [newMessage, setNewMessage] = useState('')

    if (accountQuery.isLoading || chatSessionQuery.isLoading) {
        return <div>Loading...</div>
    }

    if (accountQuery.isError || chatSessionQuery.isError) {
        return <div>Error: {(accountQuery.error as Error)?.message || (chatSessionQuery.error as Error)?.message}</div>
    }

    const handleSendMessage = () => {
        // Implement send message logic here
        console.log('Sending message:', newMessage)
        setNewMessage('')
    }

    return (
        <div className="container mx-auto p-10 h-screen flex flex-col bg-[#F5E6D3]">
            <h1 className="text-3xl font-bold mb-4 text-[#4A3728] flex items-center">
                <Coffee className="mr-2" /> Coffee Chat - Merchant Edition
            </h1>
            
            <div className="flex-grow flex overflow-hidden">
                {/* Chat List Sidebar */}
                <Card className="w-1/3 mr-4 overflow-hidden flex flex-col bg-[#E6D2BA] border-[#8B5E3C]">
                    <CardContent className="p-4 flex-grow flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                            <Avatar className="w-10 h-10 border-2 border-[#8B5E3C]">
                                <AvatarImage src={account?.avatar} alt={account?.userName} />
                                <AvatarFallback>{account?.userName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-[#4A3728]">{account?.userName}</p>
                                <p className="text-sm text-[#6F4E37]">{account?.email}</p>
                            </div>
                        </div>
                        <div className="relative mb-4">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#8B5E3C]" />
                            <Input className="pl-8 bg-[#F5E6D3] border-[#8B5E3C] text-[#4A3728] placeholder-[#8B5E3C]" placeholder="Search conversations..." />
                        </div>
                        <ScrollArea className="flex-grow">
                          {chatSessions.length > 0 ? (
                            chatSessions.map((session) => (
                              <div
                                key={session.id}
                                className={`p-2 cursor-pointer hover:bg-[#D2B48C] ${selectedSession?.id === session.id ? 'bg-[#D2B48C]' : ''}`}
                                onClick={() => setSelectedSession(session)}
                              >
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-10 h-10 border-2 border-[#8B5E3C]">
                                    <AvatarFallback>{session.id?.slice(-2) || "MC"}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-[#4A3728]">Session Chat</p>
                                    <p className="text-sm text-[#6F4E37] truncate">
                                      {session.messages[session.messages.length - 1]?.message || 'No messages'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-[#6F4E37] text-center">
                                You don't have any messages at the moment.
                                <br />
                                Start a new conversation!
                              </p>
                            </div>
                          )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Main Chat Area */}
                <Card className="flex-grow overflow-hidden flex flex-col bg-[#F5E6D3] border-[#8B5E3C]">
                    {selectedSession && (
                        <CardHeader className="p-4 border-b border-[#8B5E3C] flex flex-row items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Avatar className="w-10 h-10 border-2 border-[#8B5E3C]">
                                    <AvatarFallback>{selectedSession.id?.slice(-2) || "MC"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-[#4A3728]">Session Chat</p>
                                    <p className="text-sm text-[#6F4E37]">
                                        {selectedSession.messages.length} messages
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-[#8B5E3C] hover:text-[#6F4E37] hover:bg-[#E6D2BA]">
                                <MoreVertical className="h-5 w-5" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </CardHeader>
                    )}
                    <CardContent className="p-4 flex-grow flex flex-col">
                      {chatSessions.length > 0 ? (
                        selectedSession ? (
                          <>
                            <ScrollArea className="flex-grow mb-4">
                              {selectedSession.messages.map((message, index) => (
                                <div key={index} className={`mb-4 flex ${message.sender === account?.userName ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[70%] ${message.sender === account?.userName ? 'bg-[#8B5E3C] text-white' : 'bg-[#D2B48C] text-[#4A3728]'} rounded-lg p-3 relative`}>
                                    <p>{message.message}</p>
                                    <div 
                                      className={`absolute bottom-0 ${message.sender === account?.userName ? '-right-2 border-l-[#8B5E3C]' : '-left-2 border-r-[#D2B48C]'} w-4 h-4 border-8 border-t-transparent border-b-transparent`}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </ScrollArea>
                            <div className="flex mt-4">
                              <Input
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-grow mr-2 bg-[#F5E6D3] border-[#8B5E3C] text-[#4A3728] placeholder-[#8B5E3C]"
                              />
                              <Button onClick={handleSendMessage} className="bg-[#8B5E3C] hover:bg-[#6F4E37]">
                                <Send className="w-4 h-4" />
                                <span className="sr-only">Send message</span>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex-grow flex items-center justify-center text-[#6F4E37]">
                            Select a conversation to start chatting
                          </div>
                        )
                      ) : (
                        <div className="flex-grow flex items-center justify-center text-[#6F4E37]">
                          <p className="text-center">
                            Welcome to Coffee Chat!
                            <br />
                            You don't have any conversations yet.
                            <br />
                            Start a new chat to begin messaging.
                          </p>
                        </div>
                      )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}