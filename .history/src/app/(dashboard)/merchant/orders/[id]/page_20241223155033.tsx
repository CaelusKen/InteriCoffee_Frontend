import MerchantOrderDetails from '@/components/custom/sections/body/merchant/orders/order-details'
import React from 'react'

export default function page({params} : { params: {id: string }}) {
  return (
    <MerchantOrderDetails id={params.id}/>
  )
}