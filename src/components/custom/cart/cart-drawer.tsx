'use client'

import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from './cart-context'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total } = useCart()

  const { data: session } = useSession();

  const router = useRouter();

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
          { items.length > 0 ? 
            (items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.price.toLocaleString("vi-VN", {style: 'currency', currency: 'VND'})}</p>
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
            ))) : (
              <span className='flex flex-col'>
                <p className="font-semibold">There are no items added to cart yet</p>
                <em>Continue browsing and add items to the cart</em>
              </span>
            )}
        </div>
        <Separator className='my-4'/>
        <div className="mt-8">
          <p className="text-lg font-semibold text-right">Total: {total.toLocaleString("vi-VN", {style: 'currency', currency: 'VND'})}</p>
          {
              items.length > 0 ? (
                  session === null ? 
                  (
                    <div className='flex flex-col justify-center'>
                      <Button onClick={() => router.push('/login')} className="w-full mt-4">Login</Button>
                      <em className='w-full text-center'>You have to login in order to buy these items</em>
                    </div>
                  ): 
                  (
                    <Button onClick={() => router.push('/customer/checkout')} className="w-full mt-4">Checkout</Button>
                  )
              ) : (
                <em>Cannot checkout when you cart's empty</em>
              )
          }
          
        </div>
      </SheetContent>
    </Sheet>
  )
}