import ManagerOrderTicket from '@/components/custom/sections/body/manager/orders/order-detail'
import React from 'react'

export default function ManagerOrderDetails({params}: {params: {id: string}}) {
  return (
    <ManagerOrderTicket id={params.id}/>
  )
}
