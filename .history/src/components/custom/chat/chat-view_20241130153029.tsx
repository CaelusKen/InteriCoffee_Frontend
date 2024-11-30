'use client'

import { useState } from 'react'
import { Send, Image, Video, Phone, User } from 'lucide-react'
import { motion } from 'framer-motion'

const messages = [
  { id: 1, sender: 'Espresso Emporium', content: 'Welcome to Espresso Emporium! How can we help you today?', timestamp: '10:00 AM' },
  { id: 2, sender: 'Customer', content: 'Hi! I\'m looking for a new coffee blend. Any recommendations?', timestamp: '10:05 AM' },
  { id: 3, sender: 'Espresso Emporium', content: 'Our new Mocha Java blend is getting rave reviews. It\'s a medium roast with notes of chocolate and fruit. Would you like to try a sample?', timestamp: '10:08 AM' },
]

interface ChatViewProps {
    role: string;
    chatId: string;
}

export default function ChatView({ role, chatId }: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex-grow flex flex-col bg-secondary-100 dark:bg-secondary-900">
      <div className="p-4 bg-secondary-200 dark:bg-secondary-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-baseBlack dark:text-baseWhite">Espresso Emporium</h2>
        <div className="flex items-center space-x-2">
          {role === 'merchant' && (
            <motion.button
              className="p-2 rounded-full bg-primary-500 text-baseWhite"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <User size={20} />
            </motion.button>
          )}
          <motion.button
            className="p-2 rounded-full bg-primary-500 text-baseWhite"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Phone size={20} />
          </motion.button>
        </div>
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
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg bg-baseWhite dark:bg-neutrals-800 text-baseBlack dark:text-baseWhite"
          />
          <motion.button
            onClick={sendMessage}
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