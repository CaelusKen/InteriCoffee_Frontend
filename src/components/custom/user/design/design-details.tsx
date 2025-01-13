"use client";

import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Room as EditorRoom, Furniture } from "@/types/room-editor";
import {
  Room as FrontendRoom,
  APIDesign,
  Product,
} from "@/types/frontend/entities";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import SceneContent from "@/components/custom/room-editor/scene-view";
import { Canvas } from "@react-three/fiber";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FurnitureProductCard from "../../cards/furniture-card-v2";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccessToken } from "@/hooks/use-access-token";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useCart } from "../../cart/cart-context";
import { useToast } from "@/hooks/use-toast";

interface DesignDetailsProps {
  id: string;
}

const fetchDesignById = async (id: string, accessToken: string): Promise<ApiResponse<APIDesign>> => {
  console.log("Fetching design with id:", id);
  try {
    const response = await api.getById<APIDesign>("designs", id, accessToken);
    console.log("Fetched design:", response);
    return response;
  } catch (error) {
    console.error("Error fetching design:", error);
    throw error;
  }
};

const fetchProducts = async (): Promise<
  ApiResponse<PaginatedResponse<Product>>
> => {
  return api.getPaginated<Product>("products", undefined);
};

const deleteDesign = async (id: string, accessToken: string): Promise<ApiResponse<APIDesign>> => {
  return api.delete<APIDesign>(`designs/${id}`, accessToken)
}

const CustomerDesignDetails = ({ id }: DesignDetailsProps) => {
  const router = useRouter()

  const accessToken = useAccessToken()

  const { addItem } = useCart()

  const { toast } = useToast()

  const designQuery = useQuery({
    queryKey: ["design", id],
    queryFn: () => fetchDesignById(id, accessToken ?? ''),
    enabled: !!id,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const design = designQuery.data?.data;
  const products = productsQuery.data?.data.items || [];

  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [environment, setEnvironment] = useState("apartment");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const floors = design?.floors || [];
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

  const designProducts = () : Product[] => {
    //Get all products in the design
    const productIds = design?.products?.map((f) => f.id);
    const designProducts = products.filter((product) =>
      productIds?.includes(product.id)
    );
    return designProducts;
  };

  const handleAddAllProductsToCart = async() => {
    try {
      const cartProducts = designProducts() ;
      await cartProducts.map(cartProduct => {
        addItem(
          {
            id: cartProduct.id,
            name: cartProduct.name,
            price: cartProduct.truePrice,
            quantity: 1,
          }
        )
      })
      toast({
        title: "Add to cart successfully",
        description: "All products in this design have been added to your cart",
        className: "bg-green-500",
      });
    } catch (err) {
      toast({
        title: "Add to cart fail",
        description: `Error adding products to cart: ${err}`,
        className: "bg-red-500"
      });
      console.error("Error adding products to cart:", err);
    }
  }

  const handleEnvironmentChange = (newEnvironment: string) => {
    setEnvironment(newEnvironment);
  };

  const handleDeleteDialog = () => {
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (confirmDelete === design?.name) {
      setDeleteDialogOpen(false);
      setConfirmDelete("");
      try {
        const response = await deleteDesign(id, accessToken ?? "");
        console.log("Deleted design:", response);
        router.push("/customer");
      } catch (error) {
        console.error("Error deleting design:", error);
      }
    }
  }

  if (designQuery.isLoading) return <div>Loading design...</div>;
  if (designQuery.isError) {
    console.error("Error in designQuery:", designQuery.error);
    return (
      <div>Error loading design: {(designQuery.error as Error).message}</div>
    );
  }
  if (!design) return <div>No design found for id: {id}</div>;

  return (
    <div className="flex flex-col space-y-4 p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{design.name}</h1>
        <div className="flex gap-4 items-center">
          <Button onClick={() => router.push(`/simulation?designId=${design.id}`)}>
            <Edit size={24}/>
            Edit
          </Button>
          <Button variant={'destructive'} onClick={() =>handleDeleteDialog()}>
            <Trash2 size={24}/>
            Remove
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Design Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{design.description}</p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Products Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p>
                {designProducts().length} product{(designProducts().length === 1)? "" : "s"} used in this design
              </p>
              <Button onClick={handleAddAllProductsToCart}>
                <ShoppingBag />
                Add them to cart
              </Button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designProducts().map((product) => (
                <li key={product.id}>
                  <FurnitureProductCard
                    id={product.id}
                    images={product.images.normalImages}
                    merchant={product.merchantId}
                    modelUrl={product.modelTextureUrl}
                    name={product.name}
                    price={product.truePrice}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-2xl font-bold">Design Preview</h3>
      <div className="flex space-x-4">
        <div className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-4">
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

      {/* Dialog for Delete */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this design?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              design and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="name" className="text-left">
                Type design name to confirm
              </Label>
              <Input
                id="name"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                className="w-full"
                placeholder={design.name}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={confirmDelete !== design.name}
            >
              Delete Design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDesignDetails;
