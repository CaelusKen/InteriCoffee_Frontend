import React from 'react'

export default function FurnitureDetails({ params }: { params: { furnitureId: string } })  {
  return (
    <div>Furniture {params.furnitureId} Details</div>
  )
}
