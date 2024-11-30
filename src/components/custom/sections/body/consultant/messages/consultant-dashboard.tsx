'use client'

import { useState } from 'react'
import { Coffee, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatList from '@/components/custom/chat/chat-list'
import ChatView from '@/components/custom/chat/chat-view'

export default function ConsultantDashboard() {
  const [activeChat, setActiveChat] = useState(1)

  return (
    <div className="flex h-screen bg-baseWhite dark:bg-baseBlack">
      <nav className="w-16 bg-secondary-200 dark:bg-secondary-800 p-4 flex flex-col items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-secondary-500 text-baseWhite"
        >
          <MessageSquare size={24} />
        </motion.button>
        <Coffee size={32} className="text-secondary-500" />
      </nav>
      <div className="flex-grow flex">
        <ChatList role="consultant" onSelectChat={setActiveChat} />
        {activeChat ? (
          <ChatView role="consultant" chatId={activeChat} />
        ) : (
          <div className="flex-grow flex items-center justify-center bg-secondary-100 dark:bg-secondary-900">
            <p className="text-xl text-neutrals-500">Select a chat to start consulting</p>
          </div>
        )}
      </div>
    </div>
  )
}