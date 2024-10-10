'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Notification = () => {
  const notifications = [
    { id: 1, message: "New order received", time: "5 minutes ago" },
    { id: 2, message: "Home Essentials's product is shipped", time: "2 hours ago" },
    { id: 3, message: "New merchant registered", time: "1 day ago" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg">
        <DropdownMenuLabel className="text-black font-semibold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="cursor-pointer focus:bg-gray-100">
            <div className="flex flex-col">
              <span className="font-medium text-black">{notification.message}</span>
              <span className="text-sm text-gray-500">{notification.time}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem className="cursor-pointer focus:bg-gray-100">
          <span className="text-blue-500 font-medium">View all notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notification