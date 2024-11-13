import FurnitureDetailsSection from '@/components/custom/sections/body/furnitures/details'
import React from 'react'


export default async function FurnitureDetails({ params }: { params: { id: string} } )  {

  return (
    <FurnitureDetailsSection id={params.id}/>
  )
}
