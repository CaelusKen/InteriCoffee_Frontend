'use client'

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit2, Trash2, Maximize2, CheckIcon } from 'lucide-react'
import SceneContent from '@/components/custom/room-editor/scene-view'
import { TemplateData, Furniture, Room, TransformUpdate } from '@/types/room-editor'
import { Room as FrontendRoom } from '@/types/frontend/entities'
import { Room as EditorRoom } from '@/types/room-editor'
import FurnitureProductCard from '@/components/custom/cards/furniture-card-v2'
import { ApiResponse } from '@/types/api'
import { Product, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/use-access-token'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [environment, setEnvironment] = useState("apartment");

  const [isFullscreen, setIsFullscreen] = useState(false)
  const router = useRouter()
  
  const templateQuery = useQuery({
    queryKey: ['template', id],
    queryFn: () => fetchTemplateById(id, accessToken ?? ''),
  })

  const template = templateQuery.data?.data

  const floors = template?.floors || [];
  const rooms = selectedFloor
    ? floors.find((f) => f.id === selectedFloor)?.rooms || []
    : [];

  const currentRoom: FrontendRoom | undefined = rooms.find(
    (r) => r.name === selectedRoom
  );

  const mapToEditorRoom = (frontendRoom: FrontendRoom): EditorRoom => ({
    id: frontendRoom.name,
    name: frontendRoom.name,
    width: frontendRoom.width,
    length: frontendRoom.length,
    height: frontendRoom.height,
    furnitures: frontendRoom.furnitures.map((f) => ({
      id: f.id,
      name: f.name,
      model: f.model,
      position: (f.position as [number, number, number]) || [0, 0, 0],
      rotation: (f.rotation as [number, number, number]) || [0, 0, 0],
      scale: (f.scale as [number, number, number]) || [1, 1, 1],
      visible: true,
      category: ["default"],
    })),
    nonFurnitures:
      frontendRoom.nonFurnitures?.map((f) => ({
        id: f.id,
        name: f.name,
        model: f.model,
        position: (f.position as [number, number, number]) || [0, 0, 0],
        rotation: (f.rotation as [number, number, number]) || [0, 0, 0],
        scale: (f.scale as [number, number, number]) || [1, 1, 1],
        visible: true,
        category: ["default"],
      })) || [],
  });

  const editorRoom: EditorRoom | undefined = useMemo(() => {
    if (!currentRoom) return undefined;
    return mapToEditorRoom(currentRoom);
  }, [currentRoom]);

  const furniture: Furniture[] = editorRoom
    ? [...editorRoom.furnitures, ...(editorRoom.nonFurnitures || [])]
    : [];
    
  const handleEnvironmentChange = (newEnvironment: string) => {
    setEnvironment(newEnvironment);
  };

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
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 3D preview content */}
              {template?.type === "Template" && (
                <>
                  <div className="flex space-x-4">
                    <div className="flex flex-col gap-4 mb-2">
                      <Label>Floor</Label>
                      <Select onValueChange={setSelectedFloor} value={selectedFloor}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {floors.map((floor) => (
                            <SelectItem key={floor.id} value={floor.id}>
                              {floor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
            
                    <div className="flex flex-col gap-4 mb-2">
                      <Label>Room</Label>
                      <Select onValueChange={setSelectedRoom} value={selectedRoom}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.name} value={room.name}>
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {editorRoom && (
                    <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                        <SceneContent
                          room={editorRoom}
                          furniture={furniture}
                          selectedItem={null}
                          onSelectItem={() => {}}
                          onUpdateTransform={() => {}}
                          transformMode="translate"
                          environment={environment}
                          onEnvironmentChange={handleEnvironmentChange}
                        />
                      </Canvas>
                    </div>
                  )}
                </>
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
              <CardTitle>Template Information</CardTitle>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold mb-2">Style</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>
                    {style}
                  </Badge>
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