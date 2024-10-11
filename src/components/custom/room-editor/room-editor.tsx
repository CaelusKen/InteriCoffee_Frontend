"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Furniture, Room, TransformUpdate } from "@/types/room-editor";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import Toolbar from "./toolbar";
import Hierarchy from "./hierarchy";
import SceneContent from "./scene-view";
import Inspector from "./inspector";
import RoomDialog from "./room-dialog";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const ROOM_SCALE_FACTOR = 10;

export default function RoomEditor() {
  const [furniture, updateFurniture, undo, redo] = useUndoRedo<Furniture[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [transformMode, setTransformMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");
  const [room, setRoom] = useState<Room>({ width: 8, length: 10, height: 3 });
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(true);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const router = useRouter();

  const calculateRoomScaleFactor = (room: Room) => {
    const maxDimension = Math.max(room.width, room.length, room.height);
    console.log(ROOM_SCALE_FACTOR / maxDimension);
    return ROOM_SCALE_FACTOR / maxDimension;
  };

  const addFurniture = (model: string) => {
    const newItem: Furniture = {
      id: Date.now(),
      name: `Furniture ${furniture.length + 1}`,
      model: model,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
    }
    updateFurniture([...furniture, newItem])
  }

  const updateTransform = ({ id, type, value }: TransformUpdate) => {
    updateFurniture(
      furniture.map((item) =>
        item.id === id ? { ...item, [type]: value } : item
      )
    );
  };

  const toggleVisibility = (id: number) => {
    updateFurniture(
      furniture.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const handleSelectItem = (id: number | null) => {
    setSelectedItem(id);
  };

  const deleteItem = (id: number) => {
    updateFurniture(furniture.filter((item) => item.id !== id));
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

  const clearAllFurniture = () => {
    updateFurniture([]);
    setSelectedItem(null);
    setIsClearDialogOpen(false);
  };

  const saveCustomerDesign = () => {
    const designState = { furniture, room };
    localStorage.setItem("customerDesign", JSON.stringify(designState));
    alert("Design saved for customer!");
  };

  const saveMerchantTemplate = () => {
    const templateState = { furniture, room };
    localStorage.setItem("merchantTemplate", JSON.stringify(templateState));
    router.push("/merchant/test/save");
  };

  const loadState = () => {
    const savedState = localStorage.getItem("merchantTemplate");
    if (savedState) {
      const { furniture: savedFurniture, room: savedRoom } =
        JSON.parse(savedState);
      updateFurniture(savedFurniture);
      setRoom(savedRoom);
      alert("State loaded!");
    } else {
      alert("No saved state found!");
    }
  };

  const handleRoomChange = (newRoom: Room) => {
    setRoom(newRoom);
    const newRoomScaleFactor = calculateRoomScaleFactor(newRoom);
    updateFurniture(
      furniture.map((item) => ({
        ...item,
        scale: item.scale.map(
          (s) => s * (newRoomScaleFactor / calculateRoomScaleFactor(room))
        ) as [number, number, number],
      }))
    );
  };

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
      />
      <div className="flex-1 flex">
        <div className="w-64 bg-background border-r">
          <Hierarchy
            furniture={furniture}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onToggleVisibility={toggleVisibility}
            onDeleteItem={deleteItem}
          />
        </div>
        <div className="flex-1">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <SceneContent
                room={room}
                furniture={furniture.filter((item) => item.visible)}
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
                furniture={furniture}
                onUpdateTransform={updateTransform}
                onDeleteItem={deleteItem}
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
        initialRoom={room}
      />
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Furniture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all furniture from the scene? This
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
