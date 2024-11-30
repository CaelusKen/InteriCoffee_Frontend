'use client'

import { useState } from 'react'
import { Send, Image, Video, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const messages = [
  { id: 1, sender: 'Espresso Emporium', content: 'Welcome to Espresso Emporium! How can we help you today?', timestamp: '10:00 AM' },
  { id: 2, sender: 'Customer', content: 'Hi, I need help selecting a coffee blend for my morning coffee.', timestamp: '10:02 AM' },
  { id: 3, sender: 'Espresso Emporium', content: 'We have a wide variety of coffee blends available. How about a Mocha Java blend?', timestamp: '10:05 AM' }
]

export default function ChatView() {
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="flex-grow flex flex-col bg-secondary-100 dark:bg-secondary-900">
      <div className="p-4 bg-secondary-200 dark:bg-secondary-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-baseBlack dark:text-baseWhite">Espresso Emporium</h2>
        <motion.button
          className="p-2 rounded-full bg-primary-500 text-baseWhite"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Phone size={20} />
        </motion.button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.sender === 'Customer' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${
                message.sender === 'Customer'
                  ? 'bg-primary-300 dark:bg-primary-700 text-baseBlack dark:text-baseWhite'
                  : 'bg-baseWhite dark:bg-neutrals-800 text-baseBlack dark:text-baseWhite'
              }`}
            >
              <p className="mb-1">{message.content}</p>
              <span className="text-xs text-neutrals-500">{message.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="p-4 bg-secondary-200 dark:bg-secondary-800">
        <div className="flex items-center space-x-2">
          <motion.button
            className="p-2 rounded-full bg-primary-500 text-baseWhite"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image size={20} />
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-primary-500 text-baseWhite"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Video size={20} />
          </motion.button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg bg-baseWhite dark:bg-neutrals-800 text-baseBlack dark:text-baseWhite"
          />
          <motion.button
            className="p-2 rounded-full bg-primary-500 text-baseWhite"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}