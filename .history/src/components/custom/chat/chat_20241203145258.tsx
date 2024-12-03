'use client';

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import io, { Socket } from "socket.io-client";
import { db } from "@/service/firebase";
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { Message, FormEvent } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/types/api";
import { Account } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";

let socket: Socket | null = null;

const fetchAccountByEmail = async(email: string): Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info`)
}

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const accountQuery = useQuery({
    queryKey: ["account", session?.user?.email],
    queryFn: () => fetchAccountByEmail(session?.user?.email ?? '')
  })

  const account = accountQuery.data?.data as Account

  useEffect(() => {
    const initializeSocket = async () => {
      await socketInitializer();
    };
    
    initializeSocket();
    fetchMessages();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [roomId]);

  const socketInitializer = async () => {
    try {
      await fetch('/api/socketio');
      socket = io("http://localhost:3000", {
        path: "/api/messages/socketio",
      });

      socket.on("connect", () => {
        console.log("Connected to Socket.IO");
        socket?.emit("join-room", roomId);
      });

      socket.on("receive-message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    } catch (error) {
      console.error("Socket initialization error:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        orderBy("timestamp", "desc"),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        
        setMessages(messagesData.reverse());
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!account?.id || !session?.user?.name) {
      console.error("User session not found");
      return;
    }

    if (inputMessage.trim() === "") return;

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: inputMessage,
          roomId,
        }),
      });

      if (response.ok) {
        setInputMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!session) {
    return <div>Please sign in to access the chat.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === account?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender.id === account?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="font-semibold">{message.sender.name}</p>
              <p>{message.content}</p>
              <p className="text-xs text-right">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setInputMessage(e.target.value)
            }
            className="flex-1"
            placeholder="Type your message..."
          />
          <Button type="submit">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}