"use client"

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit2, Trash2, Maximize2 } from 'lucide-react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function Model() {
  const gltf = useLoader(GLTFLoader, '/assets/3D/coffee_shop.glb')
  return <primitive object={gltf.scene} scale={[2, 2, 2]} position={[0, -1, 0]} />
}

export default function StyleDetails() {
  const [style, setStyle] = useState({
    id: '1',
    name: 'Modern Minimalist',
    description: 'Clean lines and neutral colors define this sleek and contemporary style.',
    thumbnail: 'https://placeholder.co/400',
    products: [
      { id: '1', name: 'Modern Leather Sofa', price: 1299.99, image: 'https://placeholder.co/400' },
      { id: '2', name: 'Glass Coffee Table', price: 399.99, image: 'https://placeholder.co/400' },
      { id: '3', name: 'Minimalist Floor Lamp', price: 149.99, image: 'https://placeholder.co/400' },
      { id: '4', name: 'Abstract Wall Art', price: 299.99, image: 'https://placeholder.co/400' },
      { id: '5', name: 'Sleek Dining Chair', price: 199.99, image: 'https://placeholder.co/400' },
    ],
    mainCategories: ['Furniture', 'Lighting', 'Decor'],
    relatedBadges: ['Minimalist', 'Contemporary', 'Neutral', 'Sleek', 'Functional']
  })

  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Styles
        </Button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{style.name}</h1>
          <div className="space-x-2">
            <Button variant="destructive" className='bg-yellow-300 hover:bg-yellow-400 text-black'>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className='bg-red-400 hover:bg-red-500'>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Style Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[400px]'}`}>
                <Canvas>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <Model />
                    <OrbitControls />
                    <Environment preset="apartment" />
                  </Suspense>
                </Canvas>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">Toggle fullscreen</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Style Information</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={style.thumbnail}
                alt={style.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-muted-foreground mb-4">{style.description}</p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Main Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {style.mainCategories.map((category, index) => (
                    <Badge key={index} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Related Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {style.relatedBadges.map((badge, index) => (
                    <Badge key={index} variant="outline">{badge}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Products in this Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {style.products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}