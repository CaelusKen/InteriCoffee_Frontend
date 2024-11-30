'use client'

import { useState } from 'react'
import ChatList from '../../chat/chat-list'
import ChatView from '../../chat/chat-view'

export default function CustomerDashboard() {
  const [activeChat, setActiveChat] = useState("")

  return (
    <div className="flex h-screen bg-baseWhite dark:bg-baseBlack">
      <ChatList role="customer" onSelectChat={setActiveChat} />
      {activeChat ? (
        <ChatView role="customer" chatId={activeChat} />
      ) : (
        <div className="flex-grow flex items-center justify-center bg-secondary-100 dark:bg-secondary-900">
          <p className="text-xl text-neutrals-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}