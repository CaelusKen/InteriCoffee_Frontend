"use client";

import React, {
  useState,
  Suspense,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Canvas } from "@react-three/fiber";
import * as RoomEditorTypes from "@/types/room-editor";
import * as FrontEndTypes from "@/types/frontend/entities";
import * as BackendTypes from "@/types/backend/entities";
import { Floor } from "@/types/room-editor";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import dynamic from 'next/dynamic'
const Toolbar = dynamic(() => import('./toolbar'))
const Hierarchy = dynamic(() => import('./hierarchy'))
const SceneContent = dynamic(() => import('./scene-view'))
const Inspector = dynamic(() => import('./inspector'))
const RoomDialog = dynamic(() => import('./room-dialog'))
const FloorSelector = dynamic(() => import('./floor-selector'))
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  saveToStorage,
  getFromStorage,
  clearStorage,
  isStorageExpired,
  getLastSavedTime,
} from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useAccessToken } from "@/hooks/use-access-token";
import { mapBackendAccountToFrontend, mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { storage } from '@/service/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { FileUpload } from "../sections/body/merchant/products/file-upload";
import { SaveDialog } from "./save-dialog";
import { useContentLoader } from "@/hooks/use-content-loader";
import { SaveTemplateDialog } from "./save-template-dialog";
import { AlertTriangle, Coffee, Trash2 } from 'lucide-react';

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

const fetchStyles = async (): Promise<
  ApiResponse<PaginatedResponse<FrontEndTypes.Style>>
> => {
  return api.getPaginated<FrontEndTypes.Style>("styles");
};

const fetchProducts = async (): Promise<
  ApiResponse<PaginatedResponse<Product>>
> => {
  return api.getPaginated<Product>("products");
};

interface RoomEditorProps {
  id?: string
}

export default function RoomEditor({ id }: RoomEditorProps) {
  const searchParams = useSearchParams()
  const [floors, updateFloors, undo, redo, canUndo, canRedo] = useUndoRedo<
    Floor[]
  >([
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
          furnitures: [],
        },
      ],
    },
  ]);
  const [selectedFloor, setSelectedFloor] = useState<string>("1");
  const [selectedRoom, setSelectedRoom] = useState<string>("1");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<string>("sunset");
  const [transformMode, setTransformMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");
  const [designImage, setDesignImage] = useState<File | null>(null)
  const [designImageUrl, setDesignImageUrl] = useState<string>('')
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(true);
  const [pinnedFurniture, setPinnedFurniture] = useState<
    RoomEditorTypes.Furniture[]
  >([]);

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
  const [saveType, setSaveType] = useState<"design" | "template" | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stylesQuery = useQuery({
    queryKey: ["styles"],
    queryFn: fetchStyles,
  });
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
  const styles = stylesQuery.data?.data.items ?? [];

  const { isLoading, designId, loadContent, loadTemplate } = useContentLoader(updateFloors, products);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const { data: session } = useSession();

  const accessToken = useAccessToken()

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Show the warning dialog when the component mounts
    setIsWarningDialogOpen(true);
  }, []);

  useEffect(() => {
    // Load state from localStorage when component mounts
    const storedState = getFromStorage<Floor[]>();
    if (storedState && !isStorageExpired()) {
      updateFloors(storedState);
      const lastSavedTime = getLastSavedTime();
      if (lastSavedTime) {
        setLastSaved(new Date(lastSavedTime));
      }
    }
  }, []);

  const saveChanges = useCallback(() => {
    saveToStorage(floors);
    const now = new Date();
    setLastSaved(now);
    toast({
      title: "Changes Saved",
      description: `Your changes were saved at ${now.toLocaleTimeString()}`,
    });
  }, [floors, toast]);

  useEffect(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set a new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveChanges();
    }, 5000); // 5 seconds delay

    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [floors, saveChanges]);

  const getCurrentRoom = useCallback(() => {
    const floor = floors.find((f) => f.id === selectedFloor);
    return floor?.rooms?.find((r) => r.id === selectedRoom.toString());
  }, [floors, selectedFloor, selectedRoom]);

  const getCurrentFurniture = useCallback(() => {
    return getCurrentRoom()?.furnitures || [];
  }, [getCurrentRoom]);

  const calculateRoomScaleFactor = (room: RoomEditorTypes.Room) => {
    const maxDimension = Math.max(room.width, room.length, room.height);
    return ROOM_SCALE_FACTOR / maxDimension;
  };

  const addFurniture = (model: string, category: ProductCategory["id"][], quantity: number) => {
    const newFurniture = Array.from({ length: quantity }, (_, index) => {
      const newItem: RoomEditorTypes.Furniture = {
        id: `${products.find(p => p.modelTextureUrl === model)?.id}${getCurrentFurniture().length + index + 1}`,
        name: `${products.find(p => p.modelTextureUrl === model)?.name} ${getCurrentFurniture().length + index + 1}`,
        model: model,
        position: [index * 0.5, 0, index * 0.5], // Offset each item slightly
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        category: category,
      };
      return newItem;
    });

    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? { ...room, furnitures: [...room.furnitures, ...newFurniture] }
                  : room
              ),
            }
          : floor
      )
    );
  };


  const updateTransform = ({
    id,
    type,
    value,
  }: RoomEditorTypes.TransformUpdate) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === selectedFloor
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === selectedRoom.toString()
                  ? {
                      ...room,
                      furnitures: room.furnitures.map((item) =>
                        item.id === id.toString()
                          ? {
                              ...item,
                              [type]: type === 'rotation'
                                ? value.map((v: number) => normalizeAngle(v)) as [number, number, number]
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

  // Helper function to normalize angle between 0 and 360 degrees
  const normalizeAngle = (angle: number): number => {
    return ((angle % 360) + 360) % 360;
  };

  const handleFloorChange = (floorId: string) => {
    // Save current floor's furniture state before switching
    const currentFloor = floors.find(f => f.id === selectedFloor);
    const currentRoom = currentFloor?.rooms?.find(r => r.id === selectedRoom);

    if (currentRoom) {
      updateFloors(
        floors.map(floor => {
          if (floor.id === selectedFloor) {
            return {
              ...floor,
              rooms: floor.rooms?.map(room => {
                if (room.id === selectedRoom) {
                  return {
                    ...room,
                    furnitures: room.furnitures.map(furniture => ({
                      ...furniture,
                      // Ensure we're storing the exact values
                      position: [...furniture.position] as [number, number, number],
                      rotation: [...furniture.rotation] as [number, number, number],
                      scale: [...furniture.scale] as [number, number, number],
                    }))
                  };
                }
                return room;
              })
            };
          }
          return floor;
        })
      );
    }

    // Then update the selected floor
    setSelectedFloor(floorId);
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
                      furnitures: room.furnitures.map((item) =>
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
                      furnitures: [
                        ...room.furnitures,
                        {
                          ...room.furnitures.find(
                            (item) => item.id === id.toString()
                          )!,
                          id: Date.now().toLocaleString(),
                          name: `${
                            room.furnitures.find(
                              (item) => item.id === id.toString()
                            )!.name
                          } (Copy)`,
                          position: [
                            room.furnitures.find(
                              (item) => item.id === id.toString()
                            )!.position[0] + 0.5,
                            room.furnitures.find(
                              (item) => item.id === id.toString()
                            )!.position[1],
                            room.furnitures.find(
                              (item) => item.id === id.toString()
                            )!.position[2] + 0.5,
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
                      furnitures: room.furnitures.filter(
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
                room.id === selectedRoom.toString()
                  ? { ...room, furnitures: [] }
                  : room
              ),
            }
          : floor
      )
    );
    setSelectedItem(null);
    setIsClearDialogOpen(false);
  };

  const handleEnvironmentChange = (newEnvironment: string) => {
    setEnvironment(newEnvironment);
  };

  const handleRenameFloor = (floorId: string, newName: string) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === floorId ? { ...floor, name: newName } : floor
      )
    );
  };

  const handleRenameRoom = (
    floorId: string,
    roomId: string,
    newName: string
  ) => {
    updateFloors(
      floors.map((floor) =>
        floor.id === floorId
          ? {
              ...floor,
              rooms: floor.rooms?.map((room) =>
                room.id === roomId ? { ...room, name: newName } : room
              ),
            }
          : floor
      )
    );
  };

  const handleSaveCustomer = useCallback(() => {
    handleSaveClick("design");
  }, []);

  const handleSaveMerchant = useCallback(() => {
    if (searchParams.get("templateId")) {
      // If editing an existing template, fetch its data
      const templateId = searchParams.get("templateId") as string;
      api.get<Template>(`templates/${templateId}`, undefined, accessToken ?? "")
        .then((res) => {
          const template = mapBackendToFrontend<Template>(res.data, "template");
          setTemplateToEdit(template);
          setIsSaveTemplateDialogOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching template:", error);
          toast({
            title: "Error",
            description: "Failed to fetch template information.",
            variant: "destructive",
          });
        });
    } else {
      // If creating a new template, just open the dialog
      setTemplateToEdit(null);
      setIsSaveTemplateDialogOpen(true);
    }
  }, [searchParams, accessToken, toast]);

  const handleSaveClick = (type: "design" | "template") => {
    setSaveType(type);
    setIsSaveDialogOpen(true);
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
                      furnitures: room.furnitures.map((item) => ({
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
    const newFloorId = (Math.max(...floors.map((f) => f.id as number)) + 1).toString();
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
                  furnitures: [],
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
                      furnitures: room.furnitures.map((item) =>
                        item.id === id.toString()
                          ? { ...item, name: newName }
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

  useEffect(() => {
    loadContent()
  }, [loadContent])

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
        canUndo={canUndo}
        canRedo={canRedo}
        onSaveCustomer={handleSaveCustomer}
        onSaveMerchant={handleSaveMerchant}
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
            onRenameFloor={handleRenameFloor}
            onRenameRoom={handleRenameRoom}
            onFloorChange={handleFloorChange}
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
                    furnitures: [],
                  }
                }
                furniture={getCurrentFurniture().filter((item) => item.visible)}
                selectedItem={selectedItem}
                onSelectItem={handleSelectItem}
                onUpdateTransform={updateTransform}
                transformMode={transformMode}
                environment={environment}
                onEnvironmentChange={handleEnvironmentChange}
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
                  <Select
                    onValueChange={handleEnvironmentChange}
                    value={environment}
                  >
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
            furnitures: [],
          }
        }
      />
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent className="bg-primary-200 border-2 border-primary-200 rounded-lg shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-primary-800 flex items-center">
              <Trash2 className="w-6 h-6 mr-2 text-primary-600" />
              Clear All Furniture
            </AlertDialogTitle>
            <AlertDialogDescription className="text-secondary-700">
              Are you sure you want to remove all furniture from the current room? 
              This action is like emptying your coffee cup - it cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel className="bg-secondary-200 text-secondary-800 hover:bg-secondary-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={clearAllFurniture}
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isWarningDialogOpen}
        onOpenChange={setIsWarningDialogOpen}
      >
        <AlertDialogContent className="bg-primary-200 border-2 border-primary-200 rounded-lg shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-primary-800 flex items-center">
              <Coffee className="w-6 h-6 mr-2 text-primary-600" />
              Beta Version: Brewing in Progress
            </AlertDialogTitle>
            <AlertDialogDescription className="text-secondary-700">
              <p className="mb-4">
                Welcome to the beta version of our Room-editor! Like a perfect cup of coffee, 
                we're still brewing and refining our features.
              </p>
              <p className="mb-4">
                Many features are meant to be upgraded and enhanced in the future. 
                Your feedback is crucial in helping us perfect our blend!
              </p>
              <p className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-primary-600" />
                Please visit our Github to raise issues or provide feedback.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setIsWarningDialogOpen(false)}
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              Got it, let's brew!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SaveDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        floors={floors}
        products={products}
        styles={styles}
        clearStorage={clearStorage}
      />
      <SaveTemplateDialog
        isOpen={isSaveTemplateDialogOpen}
        onOpenChange={setIsSaveTemplateDialogOpen}
        styles={styles}
        floors={floors}
        products={products}
      />
    </div>
  );
}