'use client'

import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Room as EditorRoom, Furniture } from '@/types/room-editor'
import { Room as FrontendRoom, APIDesign, Product } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import React, { useState, useMemo } from 'react'
import SceneContent from '@/components/custom/room-editor/scene-view'
import { Canvas } from '@react-three/fiber'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DesignDetailsProps {
  id: string
}

const fetchDesignById = async(id: string) : Promise<ApiResponse<APIDesign>> => {
  console.log('Fetching design with id:', id)
  try {
    const response = await api.getById<APIDesign>('designs', id)
    console.log('Fetched design:', response)
    return response
  } catch (error) {
    console.error('Error fetching design:', error)
    throw error
  }
}

const fetchProducts = async() : Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>('products', undefined)
}

const CustomerDesignDetails = ({ id }: DesignDetailsProps) => {
  console.log('CustomerDesignDetails rendered with id:', id)

  const designQuery = useQuery({
    queryKey: ['design', id],
    queryFn: () => fetchDesignById(id),
    enabled: !!id,
  })

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const design = designQuery.data?.data
  const products = productsQuery.data?.data.items || []

  const [selectedFloor, setSelectedFloor] = useState<string>('')
  const [selectedRoom, setSelectedRoom] = useState<string>('')
  const [environment, setEnvironment] = useState('apartment')

  const floors = design?.floors || []
  const rooms = selectedFloor ? floors.find(f => f.id === selectedFloor)?.rooms || [] : []

  const currentRoom: FrontendRoom | undefined = rooms.find(r => r.name === selectedRoom)

  const mapToEditorRoom = (frontendRoom: FrontendRoom): EditorRoom => ({
    id: frontendRoom.name,
    name: frontendRoom.name,
    width: frontendRoom.width,
    length: frontendRoom.length,
    height: frontendRoom.height,
    furnitures: frontendRoom.furnitures.map(f => ({
      id: f.id,
      name: f.name,
      model: f.model,
      position: f.position as [number, number, number] || [0, 0, 0],
      rotation: f.rotation as [number, number, number] || [0, 0, 0],
      scale: f.scale as [number, number, number] || [1, 1, 1],
      visible: true,
      category: ['default']
    })),
    nonFurnitures: frontendRoom.nonFurnitures?.map(f => ({
      id: f.id,
      name: f.name,
      model: f.model,
      position: f.position as [number, number, number] || [0, 0, 0],
      rotation: f.rotation as [number, number, number] || [0, 0, 0],
      scale: f.scale as [number, number, number] || [1, 1, 1],
      visible: true,
      category: ['default']
    })) || []
  })

  const editorRoom: EditorRoom | undefined = useMemo(() => {
    if (!currentRoom) return undefined;
    return mapToEditorRoom(currentRoom);
  }, [currentRoom]);

  const furniture: Furniture[] = editorRoom ? [...editorRoom.furnitures, ...(editorRoom.nonFurnitures || [])] : [];

  const handleEnvironmentChange = (newEnvironment: string) => {
    setEnvironment(newEnvironment)
  }

  if (designQuery.isLoading) return <div>Loading design...</div>
  if (designQuery.isError) {
    console.error('Error in designQuery:', designQuery.error)
    return <div>Error loading design: {(designQuery.error as Error).message}</div>
  }
  if (!design) return <div>No design found for id: {id}</div>

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">{design.name}</h1>
      
      <div className="flex space-x-4">
        <Select onValueChange={setSelectedFloor} value={selectedFloor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Floor" />
          </SelectTrigger>
          <SelectContent>
            {floors.map(floor => (
              <SelectItem key={floor.id} value={floor.id}>{floor.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedRoom} value={selectedRoom}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room.name} value={room.name}>{room.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Design Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{design.description}</p>
            {/* Add more design details here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Products Used</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {products.map(product => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CustomerDesignDetails