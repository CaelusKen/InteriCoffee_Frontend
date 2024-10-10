'use client'

import React from 'react'
import { useCart } from '@/components/custom/cart/cart-context'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'

export function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
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
            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
            <Button className="w-full mt-4">Proceed to Checkout</Button>
          </div>
        </>
      )}
    </div>
  )
}