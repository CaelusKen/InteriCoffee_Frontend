import FailOrderCard from '@/components/custom/cards/order-fail'
import React from 'react'

export default function OrderFailConfirmation() {
  return (
    <div className="flex flex-col h-screen md:flex-row gap-6 p-6 bg-amber-50">
      <div className='h-fit my-auto mx-auto'><FailOrderCard /></div>
    </div>
  )
}
