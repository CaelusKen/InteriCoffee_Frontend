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
  const [designId, setDesignId] = useState<string | null>(null)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveType, setSaveType] = useState<"design" | "template" | null>(null);
  const [saveName, setSaveName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const searchParams = useSearchParams()

  const { data: session } = useSession();

  const accessToken = useAccessToken()


  // This for the style selection
  const stylesQuery = useQuery({
    queryKey: ["styles"],
    queryFn: fetchStyles,
  });

  const styles = stylesQuery.data?.data.items ?? [];

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

  const handleImageUpload = (file: File, downloadURL: string) => {
    setDesignImage(file)
    setDesignImageUrl(downloadURL)
  }

  const addFurniture = (model: string, category: ProductCategory["id"][]) => {
    const newItem: RoomEditorTypes.Furniture = {
      id: `${products.find(p => p.modelTextureUrl === model)?.id}${getCurrentFurniture().length + 1}`,
      name: `${products.find(p => p.modelTextureUrl === model)?.name} ${getCurrentFurniture().length + 1}`,
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
                  ? { ...room, furnitures: [...room.furnitures, newItem] }
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

  const handleAddCustomCategory = () => {
    if (newCategory && !customCategories.includes(newCategory)) {
      setCustomCategories([...customCategories, newCategory]);
      setNewCategory("");
    }
  };


  const handleSaveCustomer = useCallback(() => {
    handleSaveClick("design");
  }, []);

  const handleSaveMerchant = useCallback(() => {
    handleSaveClick("template");
  }, []);

  const handleSaveClick = (type: "design" | "template") => {
    setSaveType(type);
    setIsSaveDialogOpen(true);
  };

  const handleSaveConfirm = async () => {
    const accountId = await api.get<FrontEndTypes.Account>(`accounts/${session?.user.email}/info`).then((res) => {
      const account = mapBackendToFrontend<FrontEndTypes.Account>(res.data, 'account')
      return account.id;
    })
    
    if (!accountId) {
      toast({
        title: "Error",
        description: "Unable to fetch account information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!saveName || !designImage) {
      toast({
        title: "Error",
        description: "Please provide a name and image for the design.",
        variant: "destructive",
      })
      return
    }

    const saveData = {
      name: saveName,
      description: saveDescription,
      status: "DRAFT", // You might want to add a status field to your form
      image: designImageUrl,
      type: saveType?.toUpperCase(),
      floors: floors.map(floor => ({
        _id: floor.id,
        name: floor.name,
        "design-template-id": searchParams.get('templateId') || '',
        rooms: floor?.rooms?.map(room => ({
          name: room.name,
          width: room.width,
          height: room.height,
          length: room.length,
          furnitures: room.furnitures.map(furniture => ({
            _id: furniture.id,
            name: furniture.name,
            model: furniture.model,
            position: furniture.position,
            rotation: furniture.rotation,
            scale: furniture.scale,
            visible: furniture.visible,
            category: furniture.category
          })),
          "non-furnitures": [] // Add this field if you have non-furniture items
        }))
      })),
      products: (() => {
        const productMap = new Map();
    
        floors.forEach(floor => {
          floor?.rooms?.forEach(room => {
            room.furnitures.forEach(furniture => {
              const matchingProducts = products.filter(product => product.modelTextureUrl === furniture.model);
              matchingProducts.forEach(product => {
                if (productMap.has(product.id)) {
                  productMap.set(product.id, productMap.get(product.id) + 1);
                } else {
                  productMap.set(product.id, 1);
                }
              });
            });
          });
        });
    
        return Array.from(productMap, ([_id, quantity]) => ({ _id, quantity }));
      })(),
      "account-id": accountId,
      "template-id": "",
      "style-id": selectedStyleId,
      categories: customCategories
    };

    await api.post("designs", saveData, accessToken ?? '').then(() => {
      // Clear local storage after successful save
      clearStorage();
      setIsSaveDialogOpen(false);
      toast({
        title: `${saveType === "design" ? "Design" : "Template"} Saved`,
        description: `Your ${saveType} has been saved to the server.`,
      });
      router.push("/customer")
    }).catch((err) => {
      console.error(`Error saving ${saveType}:`, err);
      toast({
        title: "Save Failed",
        description: `Failed to save ${saveType}. Please try again.`,
        variant: "destructive",
      });
    })
  };

  const loadDesignOrTemplate = useCallback(async () => {
    const templateId = searchParams.get('templateId')
    const loadDesignId = searchParams.get('designId')

    if (loadDesignId) {
      await loadDesign(loadDesignId)
    } else if (templateId) {
      await loadTemplate(templateId)
    }

    setIsLoading(false)
  }, [searchParams])

  useEffect(() => {
    loadDesignOrTemplate()
  }, [loadDesignOrTemplate])

  const loadDesign = async (designId: string) => {
    try {
      const response = await api.get<FrontEndTypes.APIDesign>(`designs/${designId}`, undefined, accessToken ?? '')
      const frontendDesign = mapBackendToFrontend<FrontEndTypes.APIDesign>(response.data, 'design')

      const roomEditorDesign: RoomEditorTypes.Design = {
        id: frontendDesign.id,
        createdAt: frontendDesign.createdDate,
        updatedAt: frontendDesign.updateDate,
        type: "Sketch",
        floors: frontendDesign.floors.map((floor) => ({
          id: floor.id,
          name: floor.name,
          rooms: floor.rooms.map((room) => ({
            id: room.name,
            name: room.name,
            width: room.width,
            length: room.length,
            height: room.height,
            furnitures: room.furnitures.map((furniture) => ({
              id: furniture.id,
              name: furniture.name,
              model: furniture.model,
              position: furniture.position as [number, number, number],
              rotation: furniture.rotation as [number, number, number],
              scale: furniture.scale as [number, number, number],
              visible: furniture.visible,
              category: furniture.category || [],
            })),
          })),
        })),
      }

      updateFloors(roomEditorDesign.floors)
      setDesignId(designId)
      toast({
        title: "Design loaded successfully",
        description: `Loaded design: ${frontendDesign.name}`,
      })
    } catch (error) {
      console.error("Error loading design:", error)
      toast({
        title: "Error loading design",
        description: "Failed to load the design. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadTemplate = async (templateId: string) => {
    try {
      const response = await api.get<BackendTypes.BackendTemplate>(`templates/${templateId}`);
      const backendTemplate = response.data;
  
      const frontendTemplate = mapBackendToFrontend<FrontEndTypes.Template>(backendTemplate, 'template');
  
      // Convert frontend template to RoomEditor types
      const roomEditorTemplate: RoomEditorTypes.Design = {
        id: frontendTemplate.id,
        createdAt: frontendTemplate.createdDate,
        updatedAt: frontendTemplate.updatedDate,
        type: frontendTemplate.type as "Template" | "Sketch",
        floors: frontendTemplate.floors.map((floor) => ({
          id: floor.id,
          name: floor.name,
          rooms: floor.rooms.map((room) => ({
            id: room.name, // Using room name as id since room doesn't have an id in the frontend type
            name: room.name,
            width: room.width,
            length: room.length,
            height: room.height,
            furnitures: room.furnitures.map((furniture) => ({
              id: furniture.id,
              name: furniture.name,
              model: furniture.model,
              position: furniture.position as [number, number, number],
              rotation: furniture.rotation as [number, number, number],
              scale: furniture.scale as [number, number, number],
              visible: furniture.visible,
              category: furniture.category || [],
            })),
          })),
        })),
      };
  
      console.log('RoomEditor template:', roomEditorTemplate);
  
      if (roomEditorTemplate.type === "Sketch") {
        // Pin the furniture items featured in the template
        const pinnedFurniture = products
          .filter((product) =>
            frontendTemplate.products.some((templateProduct) => templateProduct.id === product.id)
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
                furnitures: pinnedFurniture,
              },
            ],
          },
        ]);
      } else {
        // Load the template as before
        updateFloors(roomEditorTemplate.floors);
      }
  
      console.log('Floors updated:', floors);
      alert("Template loaded successfully!");
    } catch (error) {
      console.error("Error loading template:", error);
      alert("Failed to load template. Please try again.");
    }
  };

  const loadContent = useCallback(async () => {
    if (!id) {
      setIsLoading(false)
      return
    }

    try {
      // First, try to load as a design
      const designResponse = await api.getById<FrontEndTypes.APIDesign>(`designs`, id, accessToken ?? '')
      const frontendDesign = mapBackendToFrontend<FrontEndTypes.APIDesign>(designResponse.data, 'design')

      console.log('Loaded design:', frontendDesign)

      const roomEditorDesign: RoomEditorTypes.Design = {
        id: frontendDesign.id,
        createdAt: frontendDesign.createdDate,
        updatedAt: frontendDesign.updateDate,
        type: "Sketch",
        floors: frontendDesign.floors.map((floor) => ({
          id: floor.id,
          name: floor.name,
          rooms: floor.rooms.map((room) => ({
            id: room.name,
            name: room.name,
            width: room.width,
            length: room.length,
            height: room.height,
            furnitures: room.furnitures.map((furniture) => ({
              id: furniture.id,
              name: furniture.name,
              model: furniture.model,
              position: furniture.position as [number, number, number],
              rotation: furniture.rotation as [number, number, number],
              scale: furniture.scale as [number, number, number],
              visible: furniture.visible,
              category: furniture.category || [],
            })),
          })),
        })),
      }

      updateFloors(roomEditorDesign.floors)
      setDesignId(frontendDesign.id)
      toast({
        title: "Design loaded successfully",
        description: `Loaded design: ${frontendDesign.name}`,
      })
    } catch (designError) {
      console.error("Error loading design:", designError)
      
      try {
        // If it's not a design, try to load as a template
        const templateResponse = await api.getById<FrontEndTypes.Template>(`templates`, id, accessToken ?? '')
        const frontendTemplate = mapBackendToFrontend<FrontEndTypes.Template>(templateResponse.data, 'template')

        console.log('Loaded template:', frontendTemplate)

        const roomEditorTemplate: RoomEditorTypes.Design = {
          id: frontendTemplate.id,
          createdAt: frontendTemplate.createdDate,
          updatedAt: frontendTemplate.updatedDate,
          type: frontendTemplate.type as "Template" | "Sketch",
          floors: frontendTemplate.floors.map((floor) => ({
            id: floor.id,
            name: floor.name,
            rooms: floor.rooms.map((room) => ({
              id: room.name,
              name: room.name,
              width: room.width,
              length: room.length,
              height: room.height,
              furnitures: room.furnitures.map((furniture) => ({
                id: furniture.id,
                name: furniture.name,
                model: furniture.model,
                position: furniture.position as [number, number, number],
                rotation: furniture.rotation as [number, number, number],
                scale: furniture.scale as [number, number, number],
                visible: furniture.visible,
                category: furniture.category || [],
              })),
            })),
          })),
        }

        if (roomEditorTemplate.type === "Sketch") {
          // Handle sketch type template
          const pinnedFurniture = frontendTemplate.products.map((product) => ({
            id: product.id,
            name: product.id, // You might want to fetch the actual product name
            model: '', // You might want to fetch the actual model URL
            position: [0, 0, 0] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [1, 1, 1] as [number, number, number],
            visible: true,
            category: [],
          }))

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
                  furnitures: pinnedFurniture,
                },
              ],
            },
          ])
        } else {
          updateFloors(roomEditorTemplate.floors)
        }

        toast({
          title: "Template loaded successfully",
          description: `Loaded template: ${frontendTemplate.name}`,
        })
      } catch (templateError) {
        console.error("Error loading template:", templateError)
        toast({
          title: "Error loading content",
          description: "Failed to load the design or template. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [id, accessToken, toast, updateFloors])

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
      <AlertDialog
        open={isWarningDialogOpen}
        onOpenChange={setIsWarningDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Beta Version Warning</AlertDialogTitle>
            <AlertDialogDescription>
              This is a beta version of the Room-editor. Many features are meant
              to be upgraded and enhanced in the future. Please visit our Github
              to raise issues or provide feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsWarningDialogOpen(false)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Save {saveType === "design" ? "Design" : "Template"}
            </DialogTitle>
            <DialogDescription>
              Enter the details for your {saveType}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="style" className="text-right">
                Style
              </Label>
              <Select
                onValueChange={setSelectedStyleId}
                value={selectedStyleId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newCategory" className="text-right">
                Add Category
              </Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="col-span-2"
              />
              <Button onClick={handleAddCustomCategory}>Add</Button>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Categories</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {customCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded"
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
            <FileUpload
              label="Design Image"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveConfirm}>Save</Button>
            <Button variant={'outline'} onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}