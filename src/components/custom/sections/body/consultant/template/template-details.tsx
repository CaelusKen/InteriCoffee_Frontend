"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit2, Trash2, Maximize2 } from 'lucide-react'
import SceneContent from '@/components/custom/room-editor/scene-view'
import { TemplateData, Furniture, Room, TransformUpdate } from '@/types/room-editor'
import FurnitureProductCard from '@/components/custom/cards/furniture-card-v2'

export default function ConsultantTemplateDetailsPage() {
  const [template, setTemplate] = useState<TemplateData | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('merchantTemplates') || '[]') as TemplateData[]
    const styleId = params.id as string
    const selectedTemplate = savedTemplates[parseInt(styleId) - 1]
    if (selectedTemplate) {
      setTemplate(selectedTemplate)
    } else {
      router.push('/consultant/templates')
    }
  }, [params.id, router])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (!template) {
    return <div>Loading...</div>
  }

  const handleUpdateTransform = (update: TransformUpdate) => {
    // In a real application, you'd update the template state here
    console.log('Update transform:', update)
  }

  const currentRoom = template.floors[0]?.rooms[0]
  const furniture = currentRoom?.furniture || []

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.push('/merchant/styles')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Styles
        </Button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{template.templateName}</h1>
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
                <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                  <Suspense fallback={null}>
                    {currentRoom && (
                      <SceneContent
                        room={currentRoom}
                        furniture={furniture}
                        selectedItem={null}
                        onSelectItem={() => {}}
                        onUpdateTransform={handleUpdateTransform}
                        transformMode="translate"
                      />
                    )}
                    <OrbitControls makeDefault />
                    <Grid infiniteGrid />
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
              <p className="text-muted-foreground mb-4">{template.description}</p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Main Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {template.mainCategories.map((category, index) => (
                    <Badge key={index} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Sub Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {template.subCategories.map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Furniture in this Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {furniture.map((item) => (
            <FurnitureProductCard
              key={item.id}
              id={item.name}
              images={
                [
                  {
                    src: 'https://placeholder.co/400',
                    alt: 'product image'
                  },
                  {
                    src: 'https://placeholder.co/400',
                    alt: 'product image'
                  },
                  {
                    src: 'https://placeholder.co/400',
                    alt: 'product image'
                  },
                ]
              }
              merchant={'Merchant A'}
              modelUrl={item.model}
              name={item.name}
              price={500}
            />
          ))}
        </div>
      </div>
    </div>
  )
}