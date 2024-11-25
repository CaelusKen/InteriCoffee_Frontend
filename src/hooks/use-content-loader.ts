import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccessToken } from "@/hooks/use-access-token";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/service/api";
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import * as RoomEditorTypes from "@/types/room-editor";
import * as FrontEndTypes from "@/types/frontend/entities";
import * as BackendTypes from "@/types/backend/entities";

export const useContentLoader = (updateFloors: (floors: RoomEditorTypes.Floor[]) => void, products: FrontEndTypes.Product[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [designId, setDesignId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const accessToken = useAccessToken();
  const { toast } = useToast();

  const loadContent = useCallback(async() => {
    const templateId = searchParams.get('templateId');
    const loadDesignId = searchParams.get('designId');
    console.log("templateId:", templateId);
    console.log("loadDesignId:", loadDesignId);
    try {
      if (loadDesignId) {
        await loadDesign(loadDesignId);
      } else if (templateId) {
        await loadTemplate(templateId);
      } else {
        console.log("No templateId or designId found in search params");
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast({
        title: "Error loading content",
        description: "Failed to load the design or template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, accessToken, toast]);

  const loadDesign = async (designId: string) => {
    const response = await api.get<FrontEndTypes.APIDesign>(`designs/${designId}`, undefined, accessToken ?? '');
    const frontendDesign = mapBackendToFrontend<FrontEndTypes.APIDesign>(response.data, 'design');

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
    };

    updateFloors(roomEditorDesign.floors);
    setDesignId(designId);
    toast({
      title: "Design loaded successfully",
      description: `Loaded design: ${frontendDesign.name}`,
    });
  };

  const loadTemplate = async (templateId: string) => {
    try {
      const response = await api.get<BackendTypes.BackendTemplate>(`templates/${templateId}`);
      console.log("Template response:", response);
      const backendTemplate = response.data;
      console.log("Backend template:", backendTemplate);
  
      const frontendTemplate = mapBackendToFrontend<FrontEndTypes.Template>(backendTemplate, 'template');
      console.log("Frontend template:", frontendTemplate);
  
      const roomEditorTemplate: RoomEditorTypes.Design = {
        id: frontendTemplate.id,
        createdAt: frontendTemplate.createdDate,
        updatedAt: frontendTemplate.updatedDate,
        type: frontendTemplate.type as "Template" | "Sketch",
        floors: [],
      };
  
      if (frontendTemplate.type === "Sketch") {
        const templateFurniture = await Promise.all(frontendTemplate.products.map(async (templateProduct) => {
          const product = await fetchProduct(templateProduct.id);
          return {
            id: product.id,
            name: product.name,
            model: product.modelTextureUrl,
            position: [0, 0, 0] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [1, 1, 1] as [number, number, number],
            visible: true,
            category: product.categoryIds,
          };
        }));
  
        roomEditorTemplate.floors = [
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
                furnitures: templateFurniture,
              },
            ],
          },
        ];
      } else {
        roomEditorTemplate.floors = frontendTemplate.floors.map((floor) => ({
          id: floor.id ?? '',
          name: floor.name || `Floor ${floor.id}`,
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
        }));
      }
  
      updateFloors(roomEditorTemplate.floors);
  
      toast({
        title: "Template loaded successfully",
        description: `Loaded template: ${frontendTemplate.name}`,
      });
    } catch (error) {
      console.error("Error loading template:", error);
      toast({
        title: "Error loading template",
        description: "An error occurred while loading the template.",
        variant: "destructive",
      });
    }
  };
  
  // Add this helper function to fetch individual product details
  const fetchProduct = async (productId: string): Promise<FrontEndTypes.Product> => {
    const response = await api.get<BackendTypes.BackendProduct>(`products/${productId}`);
    return mapBackendToFrontend<FrontEndTypes.Product>(response.data, 'product');
  };

  return { isLoading, designId, loadContent, loadTemplate };
};
