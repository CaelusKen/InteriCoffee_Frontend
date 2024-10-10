import { StyleDetailsBody } from '@/components/custom/sections/body/styles/details'
import React from 'react'

export default function StyleDetails({ params }: { params: { styleId: string } })  {
  return (
    <StyleDetailsBody id={params.styleId}/>
  )
}