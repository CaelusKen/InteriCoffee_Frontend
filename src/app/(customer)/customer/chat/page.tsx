'use client'

import { useState, useEffect } from 'react'
import { ChatSidebar } from '@/components/custom/chat/chat-sidebar'
import { ChatMain } from '@/components/custom/chat/chat-main'
import { MerchantSearch } from '@/components/custom/chat/merchant-search'
import { FirestoreChat, FirestoreChatParticipant } from '@/types/firestore'
import { createChat, subscribeToChats, fetchChatById, fetchChatsByUserId } from '@/lib/firebase-storage'
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
  const [isLoadingChats, setIsLoadingChats] = useState(true);
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
    const loadChats = async () => {
      if (account?.id) {
        setIsLoadingChats(true);
        try {
          // Fetch all chats for the user
          const userChats = await fetchChatsByUserId(account.id);
          setChats(userChats);
          
          if (userChats.length === 0) {
            setShowMerchantSearch(true);
          } else if (!selectedChat) {
            setSelectedChat(userChats[0]);
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
          toast({
            title: "Error",
            description: "Failed to load chats. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingChats(false);
        }
      }
    };

    loadChats();

    // Set up real-time updates
    if (account?.id) {
      const unsubscribe = subscribeToChats(account.id, 'customer', (updatedChats) => {
        console.log('Received updated chats:', updatedChats);
        setChats(updatedChats);
      });

      return () => unsubscribe();
    }
  }, [account?.id, toast]);

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

    try {
      const newChatId = await createChat(account, merchant);
      const newChat = await fetchChatById(newChatId);
      
      if (newChat) {
        setChats(prevChats => [...prevChats, newChat]);
        setSelectedChat(newChat);
        setShowMerchantSearch(false);
      } else {
        throw new Error('Failed to create chat');
      }
    } catch (error) {
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
        isLoading={isLoadingChats}
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