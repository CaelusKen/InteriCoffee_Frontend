"use client"

import { Button } from '@/components/ui/button'
import React from 'react'

import { useRouter } from 'next/navigation'

const entitiesList = [
  {label: "Account", route: "/test/api/account"},
  {label: "Chat Session", route: "/test/api/chat-session"},
  {label: "Design", route: "/test/api/design"},
  {label: "Merchant", route: "/test/api/merchant"},
  {label: "Order", route: "/test/api/order"},
  {label: "Product", route: "/test/api/product"},
  {label: "Product Category", route: "/test/api/product-category"},
  {label: "Review", route: "/test/api/review"},
  {label: "Sale Campaign", route: "/test/api/sale-campaign"},
  {label: "Style", route: "/test/api/style"},
  {label: "Template", route: "/test/api/template"},
  {label: "Transaction", route: "/test/api/transaction"},
  {label: "Voucher", route: "/test/api/voucher"},
]

/**
 * This is the testing for API Calling.
 * Please only use this for testing purposes
 * Any violations can be result in corruption of the project, so please PROCEED WITH CAUTION
 * @returns 
 */
export default function TestAPIPage() {
  const router = useRouter();
  return (
    <div>
      <h1> Welcome to the Testing API Site</h1>
      <h3> Please choose an API to begin your testing process</h3>

      <ul className='grid grid-cols-4 gap-4'>
        {entitiesList.map((entity, index) => (
          <li key={index}>
            <Button variant={"default"} className='w-[200px]' onClick={() => router.push(`${entity.route}`)}>{entity.label}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
