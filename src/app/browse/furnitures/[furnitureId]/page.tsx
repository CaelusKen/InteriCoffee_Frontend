import FurnitureDetailsSection from '@/components/custom/sections/body/furnitures/details'
import React from 'react'

export default function FurnitureDetails({ params }: { params: { furnitureId: string } })  {
  return (
    <FurnitureDetailsSection 
        id='6'
        name='Coffee Shop Table'
        images={[
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
          { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
        ]}
        merchant='CafeChic'
        modelUrl='/assets/3D/coffee_shop.glb'
        price={179.99}
        key={'6'}
    />
  )
}
