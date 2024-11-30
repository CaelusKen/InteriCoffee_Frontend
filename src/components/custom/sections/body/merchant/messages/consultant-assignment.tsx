'use client'

import { useState } from 'react'
import { User, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const consultants = [
  { id: "1", name: 'Alice Johnson', assignedChats: 3 },
  { id: "2", name: 'Bob Smith', assignedChats: 2 },
  { id: "3", name: 'Charlie Brown', assignedChats: 1 },
]

export default function ConsultantAssignment() {
  const [selectedConsultant, setSelectedConsultant] = useState("")

  return (
    <div className="flex-grow p-6 bg-secondary-100 dark:bg-secondary-900 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-baseBlack dark:text-baseWhite">Consultant Assignment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map((consultant) => (
          <motion.div
            key={consultant.id}
            className={`p-4 rounded-lg cursor-pointer ${
              selectedConsultant === consultant.id
                ? 'bg-primary-300 dark:bg-primary-700'
                : 'bg-baseWhite dark:bg-neutrals-800 hover:bg-primary-200 dark:hover:bg-primary-800'
            }`}
            onClick={() => setSelectedConsultant(consultant.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center mb-2">
              <User className="mr-2 text-primary-500" size={24} />
              <h3 className="text-lg font-semibold text-baseBlack dark:text-baseWhite">{consultant.name}</h3>
            </div>
            <p className="text-sm text-neutrals-600 dark:text-neutrals-400">
              Assigned Chats: {consultant.assignedChats}
            </p>
          </motion.div>
        ))}
        <motion.div
          className="p-4 rounded-lg cursor-pointer bg-success-200 dark:bg-success-800 hover:bg-success-300 dark:hover:bg-success-700 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="mr-2 text-success-600 dark:text-success-200" size={24} />
          <span className="text-lg font-semibold text-success-600 dark:text-success-200">Add New Consultant</span>
        </motion.div>
      </div>
    </div>
  )
}

