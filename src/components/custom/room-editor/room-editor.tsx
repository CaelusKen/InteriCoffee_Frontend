"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { GLTFExporter } from 'three-stdlib'
import * as THREE from 'three'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Furniture, Room, TemplateData, TransformUpdate, Floor, CoffeeShopData } from "@/types/room-editor"
import { useUndoRedo } from "@/hooks/use-undo-redo"
import Toolbar from "./toolbar"
import Hierarchy from "./hierarchy"
import SceneContent from "./scene-view"
import Inspector from "./inspector"
import RoomDialog from "./room-dialog"
import FloorSelector from "./floor-selector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Suspense } from "react"

export default function RoomEditor() {
  const [floors, updateFloors, undo, redo] = useUndoRedo<Floor[]>([
    { id: 1, name: "Ground Floor", rooms: [{ id: 1, name: "Main Room", width: 8, length: 10, height: 3, furniture: [] }] }
  ])
  const [selectedFloor, setSelectedFloor] = useState<number>(1)
  const [selectedRoom, setSelectedRoom] = useState<number>(1)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate")
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const router = useRouter()
  const { data: session } = useSession()
  const sceneRef = useRef<THREE.Scene | null>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getCurrentRoom = useCallback(() => {
    const floor = floors.find(f => f.id === selectedFloor)
    return floor?.rooms.find(r => r.id === selectedRoom)
  }, [floors, selectedFloor, selectedRoom])

  const getCurrentFurniture = useCallback(() => {
    return getCurrentRoom()?.furniture || []
  }, [getCurrentRoom])

  useEffect(() => {
    if (session?.user) {
      loadDesign()
    }
  }, [session])

  useEffect(() => {
    if (session?.user) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave()
      }, 5000) // Auto-save every 5 seconds
    }
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [floors, session])

  const autoSave = () => {
    if (session?.user) {
      try {
        localStorage.setItem('coffeeShopDesign', JSON.stringify({ floors }))
        toast({
          title: "Design auto-saved",
          description: "Your changes have been saved automatically.",
        })
      } catch (error) {
        console.error('Auto-save failed:', error)
        toast({
          title: "Auto-save failed",
          description: "There was an error saving your changes. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const loadDesign = () => {
    try {
      const savedDesign = localStorage.getItem('coffeeShopDesign')
      if (savedDesign) {
        const parsedDesign = JSON.parse(savedDesign)
        updateFloors(parsedDesign.floors)
        toast({
          title: "Design loaded",
          description: "Your saved design has been loaded successfully.",
        })
      }
    } catch (error) {
      console.error('Load design failed:', error)
      toast({
        title: "Load design failed",
        description: "There was an error loading your saved design.",
        variant: "destructive",
      })
    }
  }

  const exportScene = useCallback(() => {
    if (!sceneRef.current) {
      console.error("Scene not available")
      return
    }
  
    const exporter = new GLTFExporter()
    const options = {
      onlyVisible: true,
      binary: false,
      maxTextureSize: 4096,
      trs: false,
      forceIndices: false,
      truncateDrawRange: true
    }
  
    const prepareSceneForExport = (scene: THREE.Object3D) => {
      const clonedScene = scene.clone()
      clonedScene.traverse((object) => {
        if (object.userData) {
          delete object.userData.listeners
          delete object.userData.handlers
        }
        if ((object as any).material) {
          (object as any).material = (object as any).material.clone()
        }
      })
      return clonedScene
    }
  
    const preparedScene = prepareSceneForExport(sceneRef.current)
  
    exporter.parse(
      preparedScene,
      (gltf) => {
        const output = JSON.stringify(gltf, null, 2)
        const blob = new Blob([output], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'coffee_shop_design.gltf'
        link.click()
        URL.revokeObjectURL(url)
      },
      (error) => {
        console.error('An error occurred while exporting the scene:', error)
        toast({
          title: "Export failed",
          description: "There was an error exporting your design. Please try again.",
          variant: "destructive",
        })
      },
      options
    )
  }, [])

  const generateShareLink = () => {
    try {
      const designData = JSON.stringify({ floors })
      const encodedData = btoa(designData)
      const shareLink = `${window.location.origin}/shared-design?data=${encodedData}`
      setShareLink(shareLink)
      setIsShareDialogOpen(true)
    } catch (error) {
      console.error('Generate share link failed:', error)
      toast({
        title: "Share link generation failed",
        description: "There was an error creating a share link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const SceneCapture = () => {
    const { scene } = useThree()
    useEffect(() => {
      sceneRef.current = scene
    }, [scene])
    return null
  }

  const addFurniture = (model: string, category: Furniture['category']) => {
    const newItem: Furniture = {
      id: Date.now(),
      name: `Furniture ${getCurrentFurniture().length + 1}`,
      model: model,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      category: category,
    }
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? { ...room, furniture: [...room.furniture, newItem] }
                : room
            ),
          }
        : floor
    ))
  }

  const handleUpdateMaterial = (id: number, material: Required<Furniture['material']>) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? {
                    ...room,
                    furniture: room.furniture.map(item =>
                      item.id === id
                        ? { ...item, material }
                        : item
                    ),
                  }
                : room
            ),
          }
        : floor
    ))
  }

  const updateTransform = ({ id, type, value }: TransformUpdate) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? {
                    ...room,
                    furniture: room.furniture.map(item =>
                      item.id === id
                        ? { ...item, [type]: type === 'rotation' ? value.map(v => v * (180 / Math.PI)) as [number, number, number] : value }
                        : item
                    ),
                  }
                : room
            ),
          }
        : floor
    ))
  }

  const toggleVisibility = (id: number) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? {
                    ...room,
                    furniture: room.furniture.map(item =>
                      item.id === id ? { ...item, visible: !item.visible } : item
                    ),
                  }
                : room
            ),
          }
        : floor
    ))
  }

  const handleSelectItem = (id: number | null) => {
    setSelectedItem(id)
  }

  const deleteItem = (id: number) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? {
                    ...room,
                    furniture: room.furniture.filter(item => item.id !== id),
                  }
                : room
            ),
          }
        : floor
    ))
    if (selectedItem === id) {
      setSelectedItem(null)
    }
  }

  const clearAllFurniture = () => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? { ...room, furniture: [] }
                : room
            ),
          }
        : floor
    ))
    setSelectedItem(null)
    setIsClearDialogOpen(false)
  }

  const handleRoomChange = (newRoom: Room) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? { ...room, ...newRoom }
                : room
            ),
          }
        : floor
    ))
  }

  const addFloor = () => {
    const newFloorId = Math.max(...floors.map(f => f.id)) + 1
    updateFloors([...floors, { id: newFloorId, name: `Floor ${newFloorId}`, rooms: [] }])
  }

  const addRoom = () => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: [...floor.rooms, { id: Date.now(), name: `Room ${floor.rooms.length + 1}`, width: 5, length: 5, height: 3, furniture: [] }],
          }
        : floor
    ))
  }

  const renameItem = (id: number, newName: string) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? {
                    ...room,
                    furniture: room.furniture.map(item =>
                      item.id === id ? { ...item, name: newName } : item
                    ),
                  }
                : room
            ),
          }
        : floor
    ))
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground">
      <Toolbar
        onAddFurniture={addFurniture}
        transformMode={transformMode}
        setTransformMode={setTransformMode}
        onUndo={undo}
        onRedo={redo}
        onSaveCustomer={autoSave}
        onSaveMerchant={autoSave}
        onLoad={loadDesign}
        onOpenRoomDialog={() => setIsRoomDialogOpen(true)}
        onClearAll={() => setIsClearDialogOpen(true)}
        onAddFloor={addFloor}
        onAddRoom={addRoom}
        onExport={exportScene}
        onShare={generateShareLink}
      />
      <div className="flex-1 flex">
        <div className="w-64 bg-background border-r">
          <FloorSelector
            floors={floors}
            selectedFloor={selectedFloor}
            selectedRoom={selectedRoom}
            onSelectFloor={setSelectedFloor}
            onSelectRoom={setSelectedRoom}
          />
          <Hierarchy
            furniture={getCurrentFurniture()}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onToggleVisibility={toggleVisibility}
            onDeleteItem={deleteItem}
            onRename={renameItem}
          />
        </div>
        <div className="flex-1">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <SceneCapture />
              <SceneContent
                room={getCurrentRoom() || { width: 0, length: 0, height: 0, id: 0, name: '', furniture: [] }}
                furniture={getCurrentFurniture().filter((item) => item.visible)}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
                onUpdateTransform={updateTransform}
                transformMode={transformMode}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="w-64 bg-background border-l">
          <Inspector
            selectedItem={selectedItem}
            furniture={getCurrentFurniture()}
            onUpdateTransform={updateTransform}
            onDeleteItem={deleteItem}
            onRename={renameItem}
            onUpdateMaterial={handleUpdateMaterial}
          />
        </div>
      </div>
      <RoomDialog
        open={isRoomDialogOpen}
        onOpenChange={setIsRoomDialogOpen}
        onSave={handleRoomChange}
        initialRoom={getCurrentRoom() || { width: 0, length: 0, height: 0, id: 0, name: '', furniture: [] }}
      />
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Furniture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all furniture from the current room? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllFurniture}>
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share Your Design</AlertDialogTitle>
            <AlertDialogDescription>
              Copy the link below to share your coffee shop design with others:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareLink} readOnly />
            <Button onClick={() => {
              navigator.clipboard.writeText(shareLink)
              toast({
                title: "Link copied",
                description: "The share link has been copied to your clipboard.",
              })
            }}>
              Copy
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsShareDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}