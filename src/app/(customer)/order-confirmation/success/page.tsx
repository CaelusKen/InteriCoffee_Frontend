import SuccessOrderCard from '@/components/custom/cards/order-success'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function OrderSuccessConfirmation() {
  return (
    <div>
      <Link href={'/customer'}>
        <ArrowLeft/>
        Back to Shopping
      </Link>
      <div className="flex flex-col h-screen md:flex-row gap-6 p-6 bg-amber-50">
        <div className='h-fit my-auto mx-auto'><SuccessOrderCard /></div>
      </div>
    </div>
  )
}
