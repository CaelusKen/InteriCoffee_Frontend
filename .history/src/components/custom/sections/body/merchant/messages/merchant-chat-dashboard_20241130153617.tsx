'use client'

import { useState } from 'react'
import { Coffee, MessageSquare, User, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatList from '@/components/custom/chat/chat-list'
import ChatView from '@/components/custom/chat/chat-view'
import ConsultantAssignment from './consultant-assignment'
import AutoMessageSettings from './auto-message-setting'

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState('chats')
  const [activeChat, setActiveChat] = useState("")

  return (
    <div className="flex h-screen bg-baseWhite dark:bg-baseBlack">
      <nav className="w-16 bg-primary-200 dark:bg-primary-800 p-4 flex flex-col items-center justify-between">
        <div className="space-y-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('chats')}
            className={`p-2 rounded-full ${
              activeTab === 'chats' ? 'bg-primary-500 text-baseWhite' : 'text-primary-900 dark:text-primary-100'
            }`}
          >
            <MessageSquare size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('consultants')}
            className={`p-2 rounded-full ${
              activeTab === 'consultants' ? 'bg-primary-500 text-baseWhite' : 'text-primary-900 dark:text-primary-100'
            }`}
          >
            <User size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-full ${
              activeTab === 'settings' ? 'bg-primary-500 text-baseWhite' : 'text-primary-900 dark:text-primary-100'
            }`}
          >
            <Settings size={24} />
          </motion.button>
        </div>
        <Coffee size={32} className="text-primary-500" />
      </nav>
      <div className="flex-grow flex">
        {activeTab === 'chats' && (
          <>
            <ChatList role="merchant" onSelectChat={setActiveChat} />
            {activeChat ? (
              <ChatView role="merchant" chatId={activeChat} />
            ) : (
              <div className="flex-grow flex items-center justify-center bg-secondary-100 dark:bg-secondary-900">
                <p className="text-xl text-neutrals-500">Select a chat to start messaging</p>
              </div>
            )}
          </>
        )}
        {activeTab === 'consultants' && <ConsultantAssignment />}
        {activeTab === 'settings' && <AutoMessageSettings />}
      </div>
    </div>
  )
}