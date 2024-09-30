"use client";

import React, { useState } from "react";
import {
  Bell,
  LayoutDashboard,
  Package,
  Palette,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

export default function MerchantSidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { name: "Product Stocks", icon: Package, id: "stocks" },
    { name: "Styles", icon: Palette, id: "styles" },
    { name: "Messages", icon: MessageSquare, id: "messages" },
    { name: "Sales Campaigns", icon: TrendingUp, id: "campaigns" },
  ];

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Merchant</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start hover:bg-primary-500 hover:text-white"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
