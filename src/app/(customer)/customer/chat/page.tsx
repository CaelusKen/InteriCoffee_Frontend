'use client'

import { useState, useEffect } from 'react'
import { ChatSidebar } from '@/components/custom/chat/chat-sidebar'
import { ChatMain } from '@/components/custom/chat/chat-main'
import { MerchantSearch } from '@/components/custom/chat/merchant-search'
import { FirestoreChat, FirestoreChatParticipant } from '@/types/firestore'
import { createChat, subscribeToChats, fetchChatById } from '@/lib/firebase-storage'
import { useSession } from 'next-auth/react'
import { ApiResponse } from '@/types/api'
import { Account, Merchant } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
  if (!email) return Promise.reject(new Error('Email is required'))
  return api.get<Account>(`accounts/${email}/info`)
}

export default function ChatPage() {
  const [chats, setChats] = useState<FirestoreChat[]>([])
  const [selectedChat, setSelectedChat] = useState<FirestoreChat | null>(null)
  const [showMerchantSearch, setShowMerchantSearch] = useState(false)
  const { data: session } = useSession()

  const { toast } = useToast()

  const accountQuery = useQuery({
    queryKey: ['account', session?.user?.email],
    queryFn: () => fetchAccountByEmail(session?.user?.email ?? ''),
    enabled: !!session?.user?.email,
    refetchInterval: 60000,
  })

  const account = accountQuery.data?.data ? mapBackendToFrontend<Account>(accountQuery.data.data, 'account') : undefined

  useEffect(() => {
    if (account?.id) {
      const unsubscribe = subscribeToChats(account.id, (updatedChats) => {
        setChats(updatedChats)
        if (updatedChats.length === 0) {
          setShowMerchantSearch(true)
        }
      })

      return () => unsubscribe()
    }
  }, [account?.id])

  const handleStartNewChat = async (merchant: Merchant) => {
    console.log('Starting new chat with merchant:', merchant);
    
    if (!account) {
      console.error('No valid account data available');
      toast({
        title: "Error",
        description: "Unable to start chat. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Account data:', account);

    try {
      console.log('Attempting to create chat...');
      const newChatId = await createChat(account, merchant);
      console.log('New chat created with ID:', newChatId);
      
      console.log('Fetching chat by ID...');
      const newChat = await fetchChatById(newChatId);
      console.log('Fetched chat:', newChat);
      
      if (newChat) {
        console.log('Updating state with new chat...');
        setChats(prevChats => [...prevChats, newChat]);
        setSelectedChat(newChat);
        setShowMerchantSearch(false);
        console.log('State updated successfully');
      } else {
        console.error('fetchChatById returned null');
        throw new Error('Failed to create chat');
      }
    } catch (error) {
      console.error('Error in handleStartNewChat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (accountQuery.isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (accountQuery.isError || !account) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Error loading account data</p>
        <button 
          onClick={() => accountQuery.refetch()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Retry
        </button>
      </div>
    )
  }

  const currentUser: FirestoreChatParticipant = {
    id: account.id,
    name: account.userName,
    email: account.email,
    avatar: account.avatar,
    role: 'customer'
  }

  return (
    <div className="flex h-screen bg-background px-10 py-4">
      <ChatSidebar 
        chats={chats} 
        selectedChat={selectedChat} 
        onSelectChat={setSelectedChat}
        onNewChat={() => setShowMerchantSearch(true)}
        currentUserId={account.id}
      />
      {showMerchantSearch ? (
        <MerchantSearch onSelectMerchant={(merchant) => handleStartNewChat(merchant)} />
      ) : (
        selectedChat && (
          <ChatMain 
            chatId={selectedChat.id}
            currentUser={currentUser}
            otherUser={selectedChat.participants.find(p => p.id !== account.id) as FirestoreChatParticipant}
          />
        )
      )}
    </div>
  )
}