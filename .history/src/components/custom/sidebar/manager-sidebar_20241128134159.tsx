"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Palette,
  ArrowLeftRight,
  User,
  ListOrdered,
  UserPlus,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils"

import { motion } from "framer-motion";

export default function ManagerSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/manager" },
    { name: "Account", icon: User, href: "/manager/accounts" },
    { name: "Products", icon: Package, href: "/manager/products" },
    { name: "Product Categories", icon: List, href: "/manager/product-categories"},
    { name: "Styles", icon: Palette, href: "/manager/styles" },
    { name: "Order", icon: ListOrdered, href: "/manager/orders" },
    { name: "Merchant Registration", icon: UserPlus, href: "/manager/merchant-registration" }
  ]

  return (
    <motion.aside
      initial={{x: -50, opacity: 0}}
      animate={{x: 0, opacity: 100}}
      transition={{ duration: 0.5}}
      className="w-64 bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Manager</h2>
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
