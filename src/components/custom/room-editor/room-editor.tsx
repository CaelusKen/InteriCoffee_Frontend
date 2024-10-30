"use client";

import React, { useState, Suspense, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Furniture, Room, TemplateData, TransformUpdate, Floor } from "@/types/room-editor";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import Toolbar from "./toolbar";
import Hierarchy from "./hierarchy";
import SceneContent from "./scene-view";
import Inspector from "./inspector";
import RoomDialog from "./room-dialog";
import FloorSelector from "./floor-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

const ROOM_SCALE_FACTOR = 10;

export default function RoomEditor() {
  const [floors, updateFloors, undo, redo] = useUndoRedo<Floor[]>([
    { id: 1, name: "Ground Floor", rooms: [{ id: 1, name: "Main Room", width: 8, length: 10, height: 3, furniture: [] }] }
  ]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const router = useRouter();

  const getCurrentRoom = useCallback(() => {
    const floor = floors.find(f => f.id === selectedFloor);
    return floor?.rooms.find(r => r.id === selectedRoom);
  }, [floors, selectedFloor, selectedRoom]);

  const getCurrentFurniture = useCallback(() => {
    return getCurrentRoom()?.furniture || [];
  }, [getCurrentRoom]);

  const calculateRoomScaleFactor = (room: Room) => {
    const maxDimension = Math.max(room.width, room.length, room.height);
    return ROOM_SCALE_FACTOR / maxDimension;
  };

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
    };
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
    ));
  };

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
    ));
  };

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
    ));
  };

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
    ));
  };

  const handleSelectItem = (id: number | null) => {
    setSelectedItem(id);
  };

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
    ));
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

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
    ));
    setSelectedItem(null);
    setIsClearDialogOpen(false);
  };

  const saveCustomerDesign = () => {
    const designState = { floors };
    localStorage.setItem("customerDesign", JSON.stringify(designState));
    alert("Design saved for customer!");
  };

  const saveMerchantTemplate = () => {
    const templateState = { floors };
    localStorage.setItem("savingTemplate", JSON.stringify(templateState));
    router.push('/consultant/templates/save');
  };

  const loadState = (templateData?: TemplateData) => {
    if (templateData) {
      updateFloors(templateData.floors);
      alert("Template loaded successfully!");
    } else {
      const savedTemplates = localStorage.getItem("merchantTemplates");
      if (savedTemplates) {
        const templates = JSON.parse(savedTemplates) as TemplateData[];
        if (templates.length > 0) {
          const latestTemplate = templates[templates.length - 1];
          updateFloors(latestTemplate.floors);
          alert("Latest template loaded successfully!");
        } else {
          alert("No templates found in localStorage!");
        }
      } else {
        alert("No saved templates found!");
      }
    }
  };

  const handleRoomChange = (newRoom: Room) => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: floor.rooms.map(room =>
              room.id === selectedRoom
                ? {
                    ...room,
                    ...newRoom,
                    furniture: room.furniture.map(item => ({
                      ...item,
                      scale: item.scale.map(
                        s => s * (calculateRoomScaleFactor(newRoom) / calculateRoomScaleFactor(room))
                      ) as [number, number, number],
                    })),
                  }
                : room
            ),
          }
        : floor
    ));
  };

  const addFloor = () => {
    const newFloorId = Math.max(...floors.map(f => f.id)) + 1;
    updateFloors([...floors, { id: newFloorId, name: `Floor ${newFloorId}`, rooms: [] }]);
  };

  const addRoom = () => {
    updateFloors(floors.map(floor => 
      floor.id === selectedFloor
        ? {
            ...floor,
            rooms: [...floor.rooms, { id: Date.now(), name: `Room ${floor.rooms.length + 1}`, width: 5, length: 5, height: 3, furniture: [] }],
          }
        : floor
    ));
  };

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
    ));
  };

  // Keyboard shortcuts
  useHotkeys('ctrl+z', undo, [undo]);
  useHotkeys('ctrl+y', redo, [redo]);
  useHotkeys('delete', () => selectedItem && deleteItem(selectedItem), [selectedItem, deleteItem]);
  useHotkeys('t', () => setTransformMode('translate'), []);
  useHotkeys('r', () => setTransformMode('rotate'), []);
  useHotkeys('s', () => setTransformMode('scale'), []);

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground">
      <Toolbar
        onAddFurniture={addFurniture}
        transformMode={transformMode}
        setTransformMode={setTransformMode}
        onUndo={undo}
        onRedo={redo}
        onSaveCustomer={saveCustomerDesign}
        onSaveMerchant={saveMerchantTemplate}
        onLoad={loadState}
        onOpenRoomDialog={() => setIsRoomDialogOpen(true)}
        onClearAll={() => setIsClearDialogOpen(true)}
        onAddFloor={addFloor}
        onAddRoom={addRoom}
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
          <Tabs defaultValue="inspector">
            <TabsList className="w-full">
              <TabsTrigger value="inspector" className="flex-1">
                Inspector
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="inspector">
              <Inspector
                selectedItem={selectedItem}
                furniture={getCurrentFurniture()}
                onUpdateTransform={updateTransform}
                onDeleteItem={deleteItem}
                onRename={renameItem}
                onUpdateMaterial={handleUpdateMaterial}
              />
            </TabsContent>
            <TabsContent value="settings">
              <div className="p-4 space-y-4">
                <div>
                  <Label>Grid Size</Label>
                  <Slider defaultValue={[10]} max={20} step={1} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-stats" />
                  <Label htmlFor="show-stats">Show Stats</Label>
                </div>
                <div>
                  <Label>Environment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="sunset">Sunset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
              Are you sure you want to remove all furniture from the current room? This
              action cannot be undone.
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
    </div>
  );
}