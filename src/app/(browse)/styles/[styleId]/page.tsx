import { StyleDetailsBody } from '@/components/custom/sections/body/styles/details'
import React from 'react'

export default async function StyleDetails({ params }: { params: Promise<{ styleId: string }> })  {
  const resolvedParams = await params;

  return (
    <StyleDetailsBody id={resolvedParams.styleId}/>
  )
}