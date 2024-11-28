'use client'

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
import { ApiResponse } from '@/types/api'
import { Product, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/use-access-token'
import FloorSelector from '../../templates/inputs/floor-selector'
import RoomSelector from '../../templates/inputs/room-selector'
import ModelViewer from '../../templates/inputs/room-preview'
import { Style } from '@/types/frontend/entities'

interface TemplateProps {
  id: string,
}

const fetchTemplateById = async(id: string, accessToken: string) : Promise<ApiResponse<Template>> => {
  return api.getById<Template>('templates', id, accessToken)
}

const fetchProductById = async(id: string, accessToken: string) : Promise<ApiResponse<Product>> => {
  return api.getById<Product>('products', id, accessToken)
}

const fetchStyleById = async (id: string): Promise<ApiResponse<Style>> => {
  return api.getById<Style>("styles", id);
};

export function ProductCard({ productId, quantity }: { productId: string, quantity: number }) {
  const accessToken = useAccessToken()
  
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId, accessToken ?? ''),
  })

  const product = productQuery.data?.data

  if (productQuery.isLoading) return <div>Loading...</div>
  if (productQuery.isError) return <div>Error loading product</div>

  return (
    <div className="space-y-4">
      <FurnitureProductCard
        id={product?.id || ''}
        images={product?.images.normalImages || []}
        merchant={product?.merchantId || ''}
        modelUrl={product?.modelTextureUrl || ''}
        name={product?.name || ''}
        price={product?.truePrice || 0}
      />
      <CardFooter>
        <CardDescription>Quantity: {quantity}</CardDescription>
      </CardFooter>
    </div>
  )
}

export default function ConsultantTemplateDetailsPage({id}: TemplateProps) {
  const accessToken = useAccessToken()
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("living_room");

  const [isFullscreen, setIsFullscreen] = useState(false)
  const router = useRouter()
  
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: () => fetchTemplateById(id, accessToken ?? ''),
  })

  const template = templateQuery.data?.data

  const styleQuery = useQuery({
    queryKey: ["style", template?.styleId],
    queryFn: () => fetchStyleById(template?.styleId || ""),
    enabled: !!template?.styleId,
  });

  const style = styleQuery.data?.data.name;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (templateQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (templateQuery.isError) {
    return <div>Error loading template</div>
  }

  const handleUpdateTransform = (update: TransformUpdate) => {
    // In a real application, you'd update the template state here
    console.log('Update transform:', update)
  }

  // const currentRoom = template.floors[0]?.rooms[0]
  // const furniture = currentRoom?.furniture || []

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.push(`/simulation?templateId=${id}`)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{template?.name}</h1>
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
              {/* 3D preview content */}
              {template?.type === "Template" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <FloorSelector
                    selectedFloor={selectedFloor}
                    onSelectFloor={setSelectedFloor}
                  />
                  <div className="mt-8">
                    <RoomSelector
                      selectedRoom={selectedRoom}
                      onSelectRoom={setSelectedRoom}
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <ModelViewer floor={selectedFloor} room={selectedRoom} />
                </div>
              </div>
              )}
              {template?.type === "Sketch" && (
                <div className="text-red-500 mb-4 flex items-center">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  This template is a sketch and cannot be viewed in the 3D model viewer.
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Style Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{template?.description}</p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Main Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {template?.categories.map((category, index) => (
                    <Badge key={index} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Furniture in this Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {template?.products.map((item, index) => (
            <ProductCard key={index} productId={item.id} quantity={item.quantity} />
          ))}
        </div>
      </div>
    </div>
  )
}