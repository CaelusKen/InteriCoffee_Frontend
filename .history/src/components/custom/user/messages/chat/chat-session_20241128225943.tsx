import React, { useState, useEffect } from 'react';
import { ref, push, onValue, off } from 'firebase/database';
import { db } from '../firebase-config';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  _id: string;
  sender: string;
  message: string;
  timestamp: string;
}

interface ChatSessionProps {
  sessionId: string;
  customerId: string;
  advisorId: string;
}

export default function ChatSession({ sessionId, customerId, advisorId }: ChatSessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const chatRef = ref(db, `chats/${sessionId}`);
    
    // Listen for new messages
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data.messages) as Message[];
        setMessages(messageList);
      }
    });

    // Cleanup listener on component unmount
    return () => off(chatRef);
  }, [sessionId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      _id: uuidv4(),
      sender: customerId, // Assuming the customer is sending the message
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    const chatRef = ref(db, `chats/${sessionId}`);
    push(chatRef, { messages: message });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded-lg ${
              msg.sender === customerId ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            }`}
          >
            <p>{msg.message}</p>
            <small className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-l-lg p-2"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

