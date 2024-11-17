'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
    setItemCount(items.reduce((sum, item) => sum + item.quantity, 0))
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id)
      if (existingItem) {
        toast.success(`Added another ${newItem.name} to your cart`)
        return prevItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      toast.success(`Added ${newItem.name} to your cart`)
      return [...prevItems, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
    toast.info('Item removed from cart')
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.reduce((acc, item) => {
        if (item.id === id) {
          if (quantity > 0) {
            acc.push({ ...item, quantity });
          } else {
            toast.info(`${item.name} removed from cart`);
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[])
    );
  }

  const clearCart = () => {
    setItems([])
    toast.info('Cart cleared')
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}