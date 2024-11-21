"use client";

import React, { useState, Suspense, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as RoomEditorTypes from "@/types/room-editor";
import * as FrontEndTypes from "@/types/frontend/entities";
import { Floor } from "@/types/room-editor";
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
import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import {
  ProductCategory,
  Template,
  Product,
  APIDesign,
} from "@/types/frontend/entities";
import { useQuery } from "@tanstack/react-query";

const ROOM_SCALE_FACTOR = 10;

const fetchProductCategories = async (): Promise<
  ApiResponse<PaginatedResponse<ProductCategory>>
> => {
  return api.getPaginated<ProductCategory>("product-categories");
};

const fetchTemplates = async (): Promise<
  ApiResponse<PaginatedResponse<Template>>
> => {
  return api.getPaginated<Template>("templates");
};

const fetchProducts = async (): Promise<
  ApiResponse<PaginatedResponse<Product>>
> => {
  return api.getPaginated<Product>("products");
};

export default function RoomEditor() {
  const [floors, updateFloors, undo, redo] = useUndoRedo<Floor[]>([
    {
      id: "1",
      name: "Ground Floor",
      rooms: [
        {
          id: "1",
          name: "Main Room",
          width: 8,
          length: 10,
          height: 3,
          furniture: [],
        },
      ],
    },
  ]);
  const [selectedFloor, setSelectedFloor] = useState<string>('1');
  const [selectedRoom, setSelectedRoom] = useState<string>("1");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [pinnedFurniture, setPinnedFurniture] = useState<RoomEditorTypes.Furniture[]>([]);
  const router = useRouter();

  const getCurrentRoom = useCallback(() => {
    const floor = floors.find((f) => f.id === selectedFloor);
    return floor?.rooms?.find((r) => r.id === selectedRoom.toString());
  }, [floors, selectedFloor, selectedRoom]);

  const getCurrentFurniture = useCallback(() => {
    return getCurrentRoom()?.furniture || [];
  }, [getCurrentRoom]);

  const calculateRoomScaleFactor = (room: RoomEditorTypes.Room) => {
    const maxDimension = Math.max(room.width, room.length, room.height);
    return ROOM_SCALE_FACTOR / maxDimension;
  };

  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
  });

  const { data: templatesData } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categories = categoriesData?.data.items ?? [];
  const templates = templatesData?.data.items ?? [];
  const products = productsData?.data.items ?? [];

  const addFurniture = (model: string, category: ProductCategory["id"][]) => {
    const newItem: RoomEditorTypes.Furniture = {
      id: Date.now().toString(),
      name: `Furniture ${getCurrentFurniture().length + 1}`,
      model: model,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      category: category,
    };
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? { ...room, furniture: [...room.furniture, newItem] }
                  : room
              ),
            }
          : floor
      )
    );
  };

  const updateTransform = ({ id, type, value }: RoomEditorTypes.TransformUpdate) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      furniture: room.furniture.map((item) =>
                        item.id === id.toString()
                          ? {
                              ...item,
                              [type]:
                                type === "rotation"
                                  ? (value.map((v) => v * (180 / Math.PI)) as [
                                      number,
                                      number,
                                      number
                                    ])
                                  : value,
                            }
                          : item
                      ),
                    }
                  : room
              ),
            }
          : floor
      )
    );
  };

  const toggleVisibility = (id: string) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      furniture: room.furniture.map((item) =>
                        item.id === id.toString()
                          ? { ...item, visible: !item.visible }
                          : item
                      ),
                    }
                  : room
              ),
            }
          : floor
      )
    );
  };

  const handleSelectItem = (id: string | null) => {
    setSelectedItem(id);
  };

  const duplicateItem = (id: string) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      furniture: [
                        ...room.furniture,
                        {
                          ...room.furniture.find((item) => item.id === id.toString())!,
                          id: Date.now().toLocaleString(),
                          name: `${
                            room.furniture.find((item) => item.id === id.toString())!.name
                          } (Copy)`,
                          position: [
                            room.furniture.find((item) => item.id === id.toString())!
                              .position[0] + 0.5,
                            room.furniture.find((item) => item.id === id.toString())!
                              .position[1],
                            room.furniture.find((item) => item.id === id.toString())!
                              .position[2] + 0.5,
                          ],
                        },
                      ],
                    }
                  : room
              ),
            }
          : floor
      )
    );
  };

  const deleteItem = (id: string) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      furniture: room.furniture.filter(
                        (item) => item.id.toString() !== id.toString()
                      ),
                    }
                  : room
              ),
            }
          : floor
      )
    );
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

  const clearAllFurniture = () => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString() ? { ...room, furniture: [] } : room
              ),
            }
          : floor
      )
    );
    setSelectedItem(null);
    setIsClearDialogOpen(false);
  };

  const saveCustomerDesign = async () => {
    const designState = { floors };
    try {
      await api.post<APIDesign>("designs", designState);
      alert("Design saved for customer!");
    } catch (error) {
      console.error("Error saving customer design:", error);
      alert("Failed to save design. Please try again.");
    }
  };

  const saveMerchantTemplate = async () => {
    const templateState = { floors };
    try {
      await api.post("templates", templateState);
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving merchant template:", error);
      alert("Failed to save template. Please try again.");
    }
  };

  const loadTemplate = async (templateId: string) => {
    try {
      const response = await api.get<FrontEndTypes.APIDesign>(
        `templates/${templateId}`
      );
      const frontendTemplate = response.data;

      // Convert frontend template back to RoomEditor types
      const roomEditorTemplate: RoomEditorTypes.Design = {
        id: frontendTemplate.id,
        createdAt: frontendTemplate.createdDate,
        updatedAt: frontendTemplate.updateDate,
        floors: frontendTemplate.floors.map((floor) => ({
          name: floor.name,
          rooms:
            floor.rooms?.map((room, index) => ({
              id: index.toString(),
              name: room.name,
              width: room.width,
              length: room.length,
              height: room.height,
              furniture: room.furnitures.map((furniture) => ({
                id: furniture.id,
                name: furniture.name,
                model: furniture.model,
                position: furniture.position as [number, number, number],
                rotation: furniture.rotation as [number, number, number],
                scale: furniture.scale as [number, number, number],
                visible: furniture.visible,
                category: furniture.category || [],
              }),
            ),
            })) || [],
        })),
        type: frontendTemplate.type as "Template" | "Sketch",
      };

      if (roomEditorTemplate.type === "Sketch") {
        // Pin the furniture items featured in the template
        const pinnedFurniture = products
          .filter((product) =>
            roomEditorTemplate.floors[0]?.rooms?.[0]?.furniture.some(
              (f) => f.id === product.id
            )
          )
          .map((product) => ({
            id: product.id,
            name: product.name,
            model: product.modelTextureUrl,
            position: [0, 0, 0] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [1, 1, 1] as [number, number, number],
            visible: true,
            category: product.categoryIds,
          }));

        updateFloors([
          {
            id: "1",
            name: "Ground Floor",
            rooms: [
              {
                id: "1",
                name: "Main Room",
                width: 8,
                length: 10,
                height: 3,
                furniture: pinnedFurniture,
              },
            ],
          },
        ]);
      } else {
        // Load the template as before
        updateFloors(roomEditorTemplate.floors);
      }
      alert("Template loaded successfully!");
    } catch (error) {
      console.error("Error loading template:", error);
      alert("Failed to load template. Please try again.");
    }
  };

  const handleRoomChange = (newRoom: RoomEditorTypes.Room) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      ...newRoom,
                      furniture: room.furniture.map((item) => ({
                        ...item,
                        scale: item.scale.map(
                          (s) =>
                            s *
                            (calculateRoomScaleFactor(newRoom) /
                              calculateRoomScaleFactor(room))
                        ) as [number, number, number],
                      })),
                    }
                  : room
              ),
            }
          : floor
      )
    );
  };

  const addFloor = () => {
    const newFloorId = Math.max(...floors.map((f) => f.id as number)) + 1;
    updateFloors([
      ...floors,
      { id: newFloorId, name: `Floor ${newFloorId}`, rooms: [] },
    ]);
  };

  const addRoom = () => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: [
                ...(floor.rooms || []),
                {
                  id: Date.now().toLocaleString(),
                  name: `Room ${(floor.rooms?.length || 0) + 1}`,
                  width: 5,
                  length: 5,
                  height: 3,
                  furniture: [],
                },
              ],
            }
          : floor
      )
    );
  };

  const renameItem = (id: string, newName: string) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      furniture: room.furniture.map((item) =>
                        item.id === id.toString() ? { ...item, name: newName } : item
                      ),
                    }
                  : room
              ),
            }
          : floor
      )
    );
  };

  // Keyboard shortcuts
  useHotkeys("ctrl+z", undo, [undo]);
  useHotkeys("ctrl+y", redo, [redo]);
  useHotkeys("delete", () => selectedItem && deleteItem(selectedItem), [
    selectedItem,
    deleteItem,
  ]);
  useHotkeys("t", () => setTransformMode("translate"), []);
  useHotkeys("r", () => setTransformMode("rotate"), []);
  useHotkeys("s", () => setTransformMode("scale"), []);

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
        onLoad={loadTemplate}
        onOpenRoomDialog={() => setIsRoomDialogOpen(true)}
        onClearAll={() => setIsClearDialogOpen(true)}
        onAddFloor={addFloor}
        onAddRoom={addRoom}
        templates={templates}
        pinnedFurniture={pinnedFurniture}
      />
      <div className="flex-1 flex">
        <div className="w-64 bg-background border-r">
          <FloorSelector
            floors={floors}
            selectedFloor={selectedFloor}
            selectedRoom={selectedRoom.toString()}
            onSelectFloor={setSelectedFloor}
            onSelectRoom={setSelectedRoom}
          />
          <Hierarchy
            furniture={getCurrentFurniture()}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onToggleVisibility={toggleVisibility}
            onDuplicateItem={duplicateItem}
            onDeleteItem={deleteItem}
            onRename={renameItem}
          />
        </div>
        <div className="flex-1">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <SceneContent
                room={
                  getCurrentRoom() || {
                    width: 0,
                    length: 0,
                    height: 0,
                    id: "0",
                    name: "",
                    furniture: [],
                  }
                }
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
        initialRoom={
          getCurrentRoom() || {
            width: 0,
            length: 0,
            height: 0,
            id: "0",
            name: "",
            furniture: [],
          }
        }
      />
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Furniture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all furniture from the current
              room? This action cannot be undone.
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
