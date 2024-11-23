"use client";

import { useAccessToken } from "@/hooks/use-access-token";
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Account, ChatSession, Message } from "@/types/frontend/entities";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Coffee } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";

const fetchAccountByEmail = async (
  email: string
): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`);
};

const fetchChatSessions = async (
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<ChatSession>>> => {
  return api.getPaginated<ChatSession>(`chat-sessions`, undefined, accessToken);
};

export default function MessengerDashboard() {
  const { data: session } = useSession();
  const accessToken = useAccessToken();
  const { emit, on } = useSocket("http://localhost:3001");

  const accountQuery = useQuery({
    queryKey: ["accountByEmail", session?.user?.email],
    queryFn: () => fetchAccountByEmail(session?.user?.email ?? ""),
    enabled: !!session?.user?.email,
  });

  const chatSessionQuery = useQuery({
    queryKey: ["chatSessions"],
    queryFn: () => fetchChatSessions(accessToken ?? ""),
    enabled: !!accessToken,
  });

  const account = accountQuery.data?.data
    ? mapBackendToFrontend<Account>(accountQuery.data.data, "account")
    : null;
  const chatSessions =
    chatSessionQuery.data?.data?.items.filter(
      (chatSession) => chatSession.customerId === account?.id
    ) ?? [];

  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedSession) {
      setMessages(selectedSession.messages);
    }
  }, [selectedSession]);

  useEffect(() => {
    on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [on]);

  if (accountQuery.isLoading || chatSessionQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (accountQuery.isError || chatSessionQuery.isError) {
    return (
      <div>
        Error:{" "}
        {(accountQuery.error as Error)?.message ||
          (chatSessionQuery.error as Error)?.message}
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedSession) {
      const message: Message = {
        id: Date.now().toString(),
        sender: account?.userName || "",
        message: newMessage,
        timeStamp: new Date(),
      };
      emit("sendMessage", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-10 h-screen flex flex-col bg-[#F5E6D3]">
      <h1 className="text-3xl font-bold mb-4 text-[#4A3728] flex items-center">
        <Coffee className="mr-2" /> Coffee Chat
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
                <p className="font-semibold text-[#4A3728]">
                  {account?.userName}
                </p>
                <p className="text-sm text-[#6F4E37]">{account?.email}</p>
              </div>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#8B5E3C]" />
              <Input
                className="pl-8 bg-[#F5E6D3] border-[#8B5E3C] text-[#4A3728] placeholder-[#8B5E3C]"
                placeholder="Search conversations..."
              />
            </div>
            <ScrollArea className="flex-grow">
              {chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-2 cursor-pointer hover:bg-[#D2B48C] ${
                      selectedSession?.id === session.id ? "bg-[#D2B48C]" : ""
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-10 h-10 border-2 border-[#8B5E3C]">
                        <AvatarFallback>{session.id.slice(-2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#4A3728]">
                          Session {session.id.slice(-4)}
                        </p>
                        <p className="text-sm text-[#6F4E37] truncate">
                          {session.messages[session.messages.length - 1]
                            ?.message || "No messages"}
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
          <CardContent className="p-4 flex-grow flex flex-col">
            {chatSessions.length > 0 ? (
              selectedSession ? (
                <>
                  <ScrollArea className="flex-grow mb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${
                          message.sender === account?.userName
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.sender === account?.userName
                              ? "bg-[#8B5E3C] text-white"
                              : "bg-[#D2B48C] text-[#4A3728]"
                          } rounded-lg p-3 relative`}
                        >
                          <p>{message.message}</p>
                          <span className="text-xs opacity-70 block mt-1">
                            {new Date(message.timeStamp).toLocaleString()}
                          </span>
                          <div
                            className={`absolute bottom-0 ${
                              message.sender === account?.userName
                                ? "-right-2 border-l-[#8B5E3C]"
                                : "-left-2 border-r-[#D2B48C]"
                            } w-4 h-4 border-8 border-t-transparent border-b-transparent`}
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
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-grow mr-2 bg-[#F5E6D3] border-[#8B5E3C] text-[#4A3728] placeholder-[#8B5E3C]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-[#8B5E3C] hover:bg-[#6F4E37]"
                    >
                      <Send className="w-4 h-4" />
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
  );
}
