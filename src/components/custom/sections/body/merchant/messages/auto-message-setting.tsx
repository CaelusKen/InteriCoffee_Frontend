'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'

const initialAutoMessages = [
  { id: "1", message: 'Welcome to our coffee shop! How can I help you today?' },
  { id: "2", message: 'Our special today is a delicious Caramel Macchiato. Would you like to try it?' },
]

export default function AutoMessageSettings() {
  const [autoMessages, setAutoMessages] = useState(initialAutoMessages)
  const [newMessage, setNewMessage] = useState('')

  const addMessage = () => {
    if (newMessage.trim()) {
      setAutoMessages([...autoMessages, { id: Date.now().toString(), message: newMessage.trim() }])
      setNewMessage('')
    }
  }

  const removeMessage = (id: string) => {
    setAutoMessages(autoMessages.filter((msg) => msg.id !== id))
  }

  return (
    <div className="flex-grow p-6 bg-secondary-100 dark:bg-secondary-900 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-baseBlack dark:text-baseWhite">Auto Message Settings</h2>
      <div className="mb-6">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new auto message..."
          className="w-full p-2 rounded-lg bg-baseWhite dark:bg-neutrals-800 text-baseBlack dark:text-baseWhite border border-neutrals-300 dark:border-neutrals-600"
        />
        <motion.button
          onClick={addMessage}
          className="mt-2 px-4 py-2 bg-primary-500 text-baseWhite rounded-lg hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="inline-block mr-2" size={18} />
          Add Message
        </motion.button>
      </div>
      <div className="space-y-4">
        {autoMessages.map((msg) => (
          <motion.div
            key={msg.id}
            className="flex items-center justify-between p-3 bg-baseWhite dark:bg-neutrals-800 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-baseBlack dark:text-baseWhite">{msg.message}</p>
            <motion.button
              onClick={() => removeMessage(msg.id)}
              className="text-error-500 hover:text-error-600 dark:text-error-400 dark:hover:text-error-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}