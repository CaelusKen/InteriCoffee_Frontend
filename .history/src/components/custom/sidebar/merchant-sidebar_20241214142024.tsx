"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation"
import {
  Bell,
  LayoutDashboard,
  Package,
  Palette,
  MessageSquare,
  TrendingUp,
  ArrowLeftRight,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils"

import { motion } from "framer-motion";

export default function MerchantSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/merchant" },
    { name: "Product Stocks", icon: Package, href: "/merchant/products" },
    { name: "Styles", icon: Palette, href: "/merchant/styles" },
    { name: "Messages", icon: MessageSquare, href: "/merchant/messages" },
    { name: "Sales Campaigns", icon: TrendingUp, href: "/merchant/campaigns" },
    { name: "Switch To Customer", icon: ArrowLeftRight, href: "/furnitures"}
  ]

  return (
    <motion.aside
      initial={{x: -50, opacity: 0}}
      animate={{x: 0, opacity: 100}}
      transition={{ duration: 0.5}}
      className="w-64 bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Merchant</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-6">
        {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start hover:bg-primary-500",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}
