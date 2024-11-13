import UpdateStyleForm from '@/components/custom/sections/body/merchant/styles/edit-style'
import React from 'react'

export default function UpdateStylesPage({ params }: { params: { id: string } }) {
  return (
    <UpdateStyleForm styleId={params.id}/>
  )
}
