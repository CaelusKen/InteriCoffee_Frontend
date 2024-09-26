'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

interface FurnitureCardProps {
  name: string
  thumbnailUrl: string
  modelUrl: string
  merchant: string
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export default function FurnitureCard({ name, thumbnailUrl, modelUrl, merchant }: FurnitureCardProps = {
  name: 'Modern Sofa',
  thumbnailUrl: '/placeholder.svg?height=300&width=400',
  modelUrl: '/assets/3d/duck.glb',
  merchant: 'Luxury Furnishings Co.'
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="w-80 overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        <div className="relative w-full h-60">
          <Image
            src={thumbnailUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300"
            style={{ opacity: isHovered ? 0 : 1 }}
          />
          {isHovered && (
            <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0 }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Suspense fallback={null}>
                  <Model url={modelUrl} />
                  <OrbitControls />
                </Suspense>
              </Canvas>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">by {merchant}</p>
      </CardFooter>
    </Card>
  )
}