import ManagerAccountDetails from '@/components/custom/sections/body/manager/accounts/account-details'
import React from 'react'

export default function ManagerCheckAccountDetails({params} : {params: {id: string}}) {
  return (
    <ManagerAccountDetails id={params.id}/>
  )
}
