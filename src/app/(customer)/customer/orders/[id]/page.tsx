import UserOrderDetails from '@/components/custom/user/user-orders/user-order-details'
import React from 'react'

export default function OrderDetails({params}: {params: {id: string}}) {
  return (
    <UserOrderDetails id={params.id}/>
  )
}
