"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../sections/body/merchant/products/file-upload";
import { api } from "@/service/api";
import { useAccessToken } from "@/hooks/use-access-token";
import { Account, Merchant, Product, Room, Template } from "@/types/frontend/entities";
import { Floor } from "@/types/room-editor";
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { ApiResponse } from "@/types/api";

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  styles: { id: string; name: string }[];
  floors: Floor[]; // Replace with proper type
  products: Product[]; // Replace with proper type
}

const fetchTemplateById = async(id: string, accessToken: string): Promise<ApiResponse<Template>> => {
  return api.getById<Template>("templates", id, accessToken?? "")
}

export function SaveTemplateDialog({
  isOpen,
  onOpenChange,
  styles,
  floors,
  products,
}: SaveTemplateDialogProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const accessToken = useAccessToken();
    const { toast } = useToast();

    const searchParams = useSearchParams();

    const isConsultant = session?.user.role === "CONSULTANT"
    const isEditing = !!searchParams.get("templateId")
  
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [selectedStyleId, setSelectedStyleId] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isImageUpdated, setIsImageUpdated] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        if(isConsultant && searchParams.get("templateId")) {
          const templateId = searchParams.get("templateId") as string;
          // Fetch existing template data if editing
          fetchTemplateById(templateId, accessToken ?? '')
            .then((res) => {
              const template = res.data
              if(template) {
                setName(template?.name?? '');
                setDescription(template?.description?? '');
                setCategories(template?.categories?? []);
                setSelectedStyleId(template?.styleId?? '');
                setImageUrl(template?.imageUrl?? '');
              }

              console.log("Fetched template data:", template);
            })
            .catch((error) => {
              console.error("Error fetching template:", error);
              toast({
                title: "Error",
                description: "Failed to fetch template information.",
                variant: "destructive",
              });
            });
        }
      } else {
        // Reset form for new template
        setName("");
        setDescription("");
        setCategories([]);
        setSelectedStyleId("");
        setImage(null);
        setImageUrl("");
        setIsImageUpdated(false);
      }
    }, [isOpen, isConsultant, accessToken, toast]);
  
    const handleAddCategory = () => {
      if (newCategory && !categories.includes(newCategory)) {
        setCategories([...categories, newCategory]);
        setNewCategory("");
      }
    };
  
    const handleImageUpload = (file: File, downloadURL: string) => {
      setImage(file);
      setImageUrl(downloadURL);
      setIsImageUpdated(true);
    };
  
    const handleSaveConfirm = async () => {
      if (!session?.user.email) {
        toast({
          title: "Error",
          description: "User not authenticated. Please log in and try again.",
          variant: "destructive",
        });
        return;
      }

      const account = await api
      .get<Account>(`accounts/${session?.user.email}/info`)
      .then((res) => {
        const account = mapBackendToFrontend<Account>(
          res.data,
          "account"
        );
        return account;
      });
      

    if (!account.id) {
      toast({
        title: "Error",
        description: "Unable to fetch account information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!name) {
      toast({
        title: "Error",
        description: `Please provide a name for the template`,
        variant: "destructive",
      });
      return;
    }
  
      try {
        let existingTemplate: Template | null = null;

        if (isEditing) {
          const response = await api.get<Template>(
            `templates/${searchParams.get("templateId")}`,
            undefined,
            accessToken?? ""
          );
          existingTemplate = mapBackendToFrontend<Template>(
            response.data,
            "template"
          );
        }

        const templateData: Partial<any> = {
          name,
          description,
          image: imageUrl ? imageUrl : '',
          status: "ACTIVE",
          type: "Template",
          floors: floors.map((floor) => ({
            _id: floor.id?.toString(),
            name: floor.name,
            "design-template-id": searchParams.get("templateId") || "",
            rooms: floor?.rooms?.map((room: Room) => ({
              name: room.name,
              width: room.width,
              height: room.height,
              length: room.length,
              furnitures: room.furnitures.map((furniture) => ({
                _id: furniture.id,
                name: furniture.name,
                model: furniture.model,
                position: furniture.position,
                rotation: furniture.rotation,
                scale: furniture.scale,
                visible: furniture.visible,
                category: furniture.category,
              })),
              "non-furnitures":
                existingTemplate?.floors
                  .find((f) => f.id === floor.id)
                  ?.rooms.find((r) => r.name === room.name)?.nonFurnitures || [],
            })),
          })),
          categories,
          products: (() => {
            const productMap = new Map();

            floors.forEach((floor) => {
              floor?.rooms?.forEach((room: Room) => {
                room.furnitures.forEach((furniture) => {
                  const matchingProducts = products.filter(
                    (product) => product.modelTextureUrl === furniture.model
                  );
                  matchingProducts.forEach((product) => {
                    if (productMap.has(product.id)) {
                      productMap.set(
                        product.id,
                        productMap.get(product.id) + 1
                      );
                    } else {
                      productMap.set(product.id, 1);
                    }
                  });
                });
              });
            });

            return Array.from(productMap, ([_id, quantity]) => ({
              _id,
              quantity,
            }));
          })(),
          "account-id": account.id,
          "merchant-id": account.merchantId,
          "style-id": selectedStyleId,
        };
  
        if (searchParams.get("templateId")) {
          // Update existing template
          await api.patch(`templates/${searchParams.get("templateId")}`, templateData, undefined, accessToken ?? "");
          toast({
            title: "Template Updated",
            description: "Your template has been updated successfully.",
          });
        } else {
          // Create new template
          await api.post("templates", templateData, accessToken ?? "");
          toast({
            title: "Template Saved",
            description: "Your template has been saved successfully.",
          });
        }
  
        onOpenChange(false);
        router.push("/consultant/templates");
      } catch (err) {
        console.error("Error saving template:", err);
        toast({
          title: "Save Failed",
          description: "Failed to save template. Please try again.",
          variant: "destructive",
        });
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{searchParams.get("templateId") ? "Edit Template" : "Save Template"}</DialogTitle>
            <DialogDescription>
              Enter the details for your template.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="style" className="text-right">
                Style
              </Label>
              <Select onValueChange={setSelectedStyleId} value={selectedStyleId}>
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
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Categories</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {categories.map((category, index) => (
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
              label="Template Image"
              accept="image/*"
              onChange={handleImageUpload}
              currentFileUrl={imageUrl}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveConfirm}>Save</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

