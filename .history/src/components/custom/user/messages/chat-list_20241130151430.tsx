'use client'

import { useState } from 'react'
import { Coffee, MessageSquare, Search, User } from 'lucide-react'
import { motion } from 'framer-motion'

const chatData = [
  { id: 1, name: 'Espresso Emporium', lastMessage: 'Your order is ready!', unread: 2 },
  { id: 2, name: 'Latte Lounge', lastMessage: 'Can you clarify your last question?', unread: 0 },
  { id: 3, name: 'Mocha Maven', lastMessage: 'We have a new blend you might like.', unread: 1 },
]

export default function ChatList() {
  const [selectedChat, setSelectedChat] = useState(1)

  return (
    <div className="w-1/4 bg-primary-100 dark:bg-primary-900 p-4 overflow-y-auto">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-2 pl-10 rounded-lg bg-baseWhite dark:bg-neutrals-800 text-baseBlack dark:text-baseWhite"
          />
          <Search className="absolute left-3 top-2.5 text-neutrals-500" size={18} />
        </div>
      </div>
      {chatData.map((chat) => (
        <motion.div
          key={chat.id}
          className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
            selectedChat === chat.id
              ? 'bg-primary-300 dark:bg-primary-700'
              : 'hover:bg-primary-200 dark:hover:bg-primary-800'
          }`}
          onClick={() => setSelectedChat(chat.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Coffee className="mr-3 text-primary-500" />
          <div className="flex-grow">
            <h3 className="font-semibold text-baseBlack dark:text-baseWhite">{chat.name}</h3>
            <p className="text-sm text-neutrals-600 dark:text-neutrals-400">{chat.lastMessage}</p>
          </div>
          {chat.unread > 0 && (
            <span className="bg-error-500 text-baseWhite text-xs font-bold px-2 py-1 rounded-full">
              {chat.unread}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

