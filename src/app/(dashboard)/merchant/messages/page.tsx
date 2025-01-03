"use client";

import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/custom/chat/chat-sidebar";
import { MerchantChatMain } from "@/components/custom/sections/body/merchant/messages/merchant-chat-main";
import { FirestoreChat, FirestoreChatParticipant } from "@/types/firestore";
import {
  subscribeToChats,
  fetchChatById,
  createChat,
} from "@/lib/firebase-storage";
import { useSession } from "next-auth/react";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Account, Merchant } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAccessToken } from "@/hooks/use-access-token";
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { CustomerSearch } from "@/components/custom/chat/customer-search";

const fetchAccountByEmail = (email: string): Promise<ApiResponse<Account>> => {
  if (!email) return Promise.reject(new Error("Email is required"));
  return api.get<Account>(`accounts/${email}/info`);
};

const fetchMerchantById = async (
  id: string,
  accessToken: string
): Promise<ApiResponse<Merchant>> => {
  return api.getById("merchants", id, accessToken);
};

export default function MerchantChatPage() {
  const [chats, setChats] = useState<FirestoreChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<FirestoreChat | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const { data: session } = useSession();

  const accessToken = useAccessToken();

  const { toast } = useToast();

  const accountQuery = useQuery({
    queryKey: ["account", session?.user?.email],
    queryFn: () => fetchAccountByEmail(session?.user?.email ?? ""),
    enabled: !!session?.user?.email,
    refetchInterval: 60000, // 1 minute
  });

  const account = accountQuery.data?.data
    ? mapBackendToFrontend<Account>(accountQuery.data.data, "account")
    : undefined;

  const {
    data: merchantData,
    isLoading: isMerchantLoading,
    isError: isMerchantError,
  } = useQuery({
    queryKey: ["merchant", account?.merchantId],
    queryFn: () =>
      fetchMerchantById(account?.merchantId ?? "", accessToken ?? ""),
    enabled: !!account?.merchantId && !!accessToken,
    refetchInterval: 60000, // 1 minute
  });

  const merchant = merchantData?.data as Merchant;

  useEffect(() => {
    if (account?.merchantId) {
      setIsLoadingChats(true);
      const unsubscribe = subscribeToChats(
        account?.merchantId,
        "merchant",
        (updatedChats) => {
          console.log("Received updated chats:", updatedChats);
          setChats(updatedChats);
          if (updatedChats.length === 0) {
            setShowCustomerSearch(true);
          } else if (!selectedChat) {
            setSelectedChat(updatedChats[0]);
          }
          setIsLoadingChats(false);
        }
      );
      return () => unsubscribe();
    }
  }, [account?.merchantId]);

  const handleNewChat = async (customer: Account) => {
    toast({
      title: "Info",
      description:
        "Merchants cannot initiate new chats. Please wait for customers to contact you.",
    });
  };

  const handleStartNewChat = async (customer: Account) => {
    if (!account) {
      console.error("No valid account data available");
      toast({
        title: "Error",
        description: "Unable to start chat. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newChatId = await createChat(customer, merchant);
      const newChat = await fetchChatById(newChatId);
      if (newChat) {
        setChats((prevChats) => [...prevChats, newChat]);
        setSelectedChat(newChat);
        setShowCustomerSearch(false);
      } else {
        console.error("fetchChatById returned null");
        throw new Error("Failed to create chat");
      }
    } catch (err) {
      console.error("Error in handleStartNewChat:", err);
      toast({
        title: "Error",
        description: "Failed to create chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (accountQuery.isLoading || isMerchantLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (accountQuery.isError || isMerchantError || !merchant) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Error loading merchant data</p>
        <button
          onClick={() => {
            accountQuery.refetch();
            if (account?.merchantId) {
              fetchMerchantById(account.merchantId, accessToken ?? "");
            }
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentUser: FirestoreChatParticipant = {
    id: merchant.id,
    name: merchant.name,
    email: merchant.email,
    avatar: merchant.logoUrl,
    role: "merchant",
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        currentUserId={merchant.id}
        onNewChat={() => setShowCustomerSearch(true)}
        isLoading={isLoadingChats}
      />
      {showCustomerSearch ? (
        <CustomerSearch
          onSelectCustomer={(customer) => handleStartNewChat(customer)}
        />
      ) : selectedChat ? (
        <div className="flex-1 max-w-full">
          <MerchantChatMain
            chatId={selectedChat.id}
            currentUser={currentUser}
            otherUser={
              selectedChat.participants.find(
                (p) => p.id !== merchant.id
              ) as FirestoreChatParticipant
            }
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p>Select a chat or wait for new customer messages</p>
        </div>
      )}
    </div>
  );
}
