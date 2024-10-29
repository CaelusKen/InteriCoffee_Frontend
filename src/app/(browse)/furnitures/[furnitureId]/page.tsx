import FurnitureDetailsSection from '@/components/custom/sections/body/furnitures/details'
import React from 'react'


export default async function FurnitureDetails({ params }: { params: Promise<{ furnitureId: string }> } )  {
  const resolvedParams = await params;

  return (
    <FurnitureDetailsSection 
        id={resolvedParams.furnitureId}
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
