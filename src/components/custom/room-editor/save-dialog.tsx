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
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import * as FrontEndTypes from "@/types/frontend/entities";
import * as RoomEditorTypes from "@/types/room-editor";
import { useAccessToken } from "@/hooks/use-access-token";

interface SaveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  floors: RoomEditorTypes.Floor[];
  products: FrontEndTypes.Product[];
  styles: FrontEndTypes.Style[];
  clearStorage: () => void;
}

export function SaveDialog({
  isOpen,
  onOpenChange,
  floors,
  products,
  styles,
  clearStorage,
}: SaveDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const accessToken = useAccessToken();
  const { toast } = useToast();

  const [saveName, setSaveName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [saveType, setSaveType] = useState<"design" | "template">("design");
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [designImageUrl, setDesignImageUrl] = useState<string>("");
  const [isImageUpdated, setIsImageUpdated] = useState(false)

  const isCustomer = session?.user.role === "CUSTOMER";
  const isEditing = !!searchParams.get("designId");

  useEffect(() => {
    if (isOpen) {
      if (isCustomer && searchParams.get("designId")) {
        const designId = searchParams.get("designId") as string;
        api
          .get<FrontEndTypes.APIDesign>(
            `designs/${designId}`,
            undefined,
            accessToken ?? ""
          )
          .then((res) => {
            const design = mapBackendToFrontend<FrontEndTypes.APIDesign>(
              res.data,
              "design"
            );
            if (design) {
              setSaveName(design.name);
              setSaveDescription(design.description);
              setCustomCategories([]);
              setSelectedStyleId(design.styleId);
              setDesignImageUrl(design.image || "");
            }
          })
          .catch((error) => {
            console.error("Error fetching design:", error);
            toast({
              title: "Error",
              description: "Failed to fetch design information.",
              variant: "destructive",
            });
          });
      } else {
        // Reset form fields when there's no designId on search params
        setSaveName("");
        setSaveDescription("");
        setCustomCategories([]);
        setSelectedStyleId("");
        setDesignImage(null);
        setDesignImageUrl("");
        setIsImageUpdated(false)
      }
    }
  }, [isOpen, isCustomer, searchParams, accessToken, toast]);

  const handleAddCustomCategory = () => {
    if (newCategory && !customCategories.includes(newCategory)) {
      setCustomCategories([...customCategories, newCategory]);
      setNewCategory("");
    }
  };

  const handleImageUpload = (file: File, downloadURL: string) => {
    setDesignImage(file)
    setDesignImageUrl(downloadURL)
    setIsImageUpdated(true)
  }

  const handleSaveConfirm = async () => {
    if (!session?.user.email) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in and try again.",
        variant: "destructive",
      });
      return;
    }

    const accountId = await api
      .get<FrontEndTypes.Account>(`accounts/${session.user.email}/info`)
      .then((res) => {
        const account = mapBackendToFrontend<FrontEndTypes.Account>(
          res.data,
          "account"
        );
        return account.id;
      });

    if (!accountId) {
      toast({
        title: "Error",
        description: "Unable to fetch account information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!saveName) {
      toast({
        title: "Error",
        description: `Please provide a name for the ${saveType}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      let existingDesign: FrontEndTypes.APIDesign | null = null;

      if (isEditing) {
        const response = await api.get<FrontEndTypes.APIDesign>(
          `designs/${searchParams.get("designId")}`,
          undefined,
          accessToken ?? ""
        );
        existingDesign = mapBackendToFrontend<FrontEndTypes.APIDesign>(
          response.data,
          "design"
        );
      }

      const saveData: Partial<any> = {
        name: saveName,
        description: saveDescription || existingDesign?.description || "",
        status: "DRAFT",
        image: designImageUrl || existingDesign?.image || "",
        type: saveType.toUpperCase(),
        floors: floors.map((floor) => ({
          _id: floor.id,
          name: floor.name,
          "design-template-id": searchParams.get("templateId") || "",
          rooms: floor?.rooms?.map((room: FrontEndTypes.Room) => ({
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
              existingDesign?.floors
                .find((f) => f.id === floor.id)
                ?.rooms.find((r) => r.name === room.name)?.nonFurnitures || [],
          })),
        })),
        products: isCustomer
          ? (() => {
              const productMap = new Map();

              floors.forEach((floor) => {
                floor?.rooms?.forEach((room: FrontEndTypes.Room) => {
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
            })()
          : [],
        "account-id": accountId,
        "template-id": existingDesign?.templateId || "",
        "style-id": selectedStyleId || existingDesign?.styleId || "",
        categories: customCategories.length > 0 ? customCategories : [],
      };

      console.log(saveData)

      if (isEditing && isCustomer) {
        // Update existing design
        const patchData: Partial<typeof saveData> = {};

        for (const [key, value] of Object.entries(saveData)) {
          if (
            JSON.stringify(
              existingDesign?.[key as keyof FrontEndTypes.APIDesign]
            ) !== JSON.stringify(value)
          ) {
            patchData[key as keyof FrontEndTypes.APIDesign] =
              value as FrontEndTypes.APIDesign[keyof FrontEndTypes.APIDesign];
          }
        }

        // Only send the PATCH request if there are changes
        if (Object.keys(patchData).length > 0) {
          await api.patch(
            `designs/${searchParams.get("designId")}`,
            patchData,
            undefined,
            accessToken ?? ""
          );
          toast({
            title: "Design Updated",
            description: "Your design has been updated on the server.",
          });
        } else {
          toast({
            title: "No Changes",
            description:
              "No changes were detected. The design was not updated.",
          });
        }
      } else {
        // Create new design or template
        await api.post("designs", saveData, accessToken ?? "");
        toast({
          title: `${saveType === "design" ? "Design" : "Template"} Saved`,
          description: `Your ${saveType} has been saved to the server.`,
        });
      }

      // Clear local storage after successful save
      clearStorage();
      onOpenChange(false);
      router.push(isCustomer ? "/customer" : "/consultant");
    } catch (err) {
      console.error(`Error saving ${saveType}:`, err);
      toast({
        title: "Save Failed",
        description: `Failed to save ${saveType}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCustomer
              ? isEditing
                ? "Edit Design"
                : "Save Design"
              : "Save Template"}
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
            currentFileUrl={designImageUrl}  
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
