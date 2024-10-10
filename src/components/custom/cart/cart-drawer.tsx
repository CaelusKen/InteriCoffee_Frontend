'use client'

import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from './cart-context'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='bg-white dark:bg-gray-800 text-black dark:text-white'>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          <Button className="w-full mt-4">Checkout</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}