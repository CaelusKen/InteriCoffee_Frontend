"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Move,
  RotateCw,
  Maximize,
  Undo,
  Redo,
  Save,
  FolderOpen,
  Home,
  Trash2,
  Plus,
} from "lucide-react";
import { ThemeToggler } from "../buttons/theme-toggler";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateData } from "@/types/room-editor";

type FurnitureCategory = "seating" | "tables" | "storage" | "other";
type FurnitureItem = {
  name: string;
  category: FurnitureCategory;
  model: string;
};

interface Template {
  id: number;
  name: string;
  items: number;
}

interface ToolbarProps {
  onAddFurniture: (model: string, furnitureType: string) => void;
  transformMode: "translate" | "rotate" | "scale";
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void;
  onUndo: () => void;
  onRedo: () => void;
  onSaveCustomer: () => void;
  onSaveMerchant: () => void;
  onLoad: (templateData: TemplateData) => void;
  onOpenRoomDialog: () => void;
  onClearAll: () => void;
}

const furnitureItems: FurnitureItem[] = [
  { name: "Sofa", category: "seating", model: "/assets/3D/sofa.glb" },
  { name: "Chair", category: "seating", model: "/assets/3D/chair.glb" },
  { name: "Modern Chair", category: "seating", model: "/assets/3D/modern-chair.glb" },
  { name: "Table", category: "tables", model: "/assets/3D/table.glb" },
  { name: "Coffee Table", category: "tables", model: "/assets/3D/coffee-table.glb" },
  { name: "Classic Coffee Table", category: "tables", model: "/assets/3D/classic-coffee-table.glb" },
  { name: "Workbench", category: "tables", model: "/assets/3D/workbench.glb" },
];

export default function Toolbar({
  onAddFurniture,
  transformMode,
  setTransformMode,
  onUndo,
  onRedo,
  onSaveCustomer,
  onSaveMerchant,
  onLoad,
  onOpenRoomDialog,
  onClearAll,
}: ToolbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadDrawerOpen, setIsLoadDrawerOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  const categories: FurnitureCategory[] = ["seating", "tables", "storage", "other"];

  const handleLoadClick = () => {
    const savedTemplates = JSON.parse(
      localStorage.getItem("merchantTemplates") || "[]"
    ) as TemplateData[];
    setTemplates(
      savedTemplates.map((template, index) => ({
        id: index + 1,
        name: `Template ${index + 1}`,
        items: template.furniture.length,
      }))
    );
    setIsLoadDrawerOpen(true);
  };

  const handleLoadTemplate = (templateId: number) => {
    const savedTemplates = JSON.parse(
      localStorage.getItem("merchantTemplates") || "[]"
    ) as TemplateData[];
    const selectedTemplate = savedTemplates[templateId - 1];
    if (selectedTemplate) {
      onLoad(selectedTemplate);
      setIsLoadDrawerOpen(false);
    } else {
      alert("Selected template not found!");
    }
  };

  return (
    <div className="flex justify-between items-center p-2 dark:bg-gray-800 border-b">
      <div className="space-x-2 mb-2 sm:mb-0">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className="text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Furniture
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-white text-black">
            <DrawerHeader>
              <DrawerTitle>Choose Furniture</DrawerTitle>
              <DrawerDescription>
                Select the type of furniture you want to add to your room.
              </DrawerDescription>
            </DrawerHeader>
            <Tabs defaultValue="seating" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {furnitureItems
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <Button
                            key={item.name}
                            onClick={() => {
                              onAddFurniture(item.model, item.category);
                              setIsDrawerOpen(false);
                            }}
                            className="w-full justify-start"
                          >
                            {item.name}
                          </Button>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="space-x-2">
        <Button
          variant={transformMode === "translate" ? "default" : "outline"}
          size="icon"
          onClick={() => setTransformMode("translate")}
          className="hover:bg-primary-600 hover:text-white"
        >
          <Move className="w-4 h-4" />
        </Button>
        <Button
          variant={transformMode === "rotate" ? "default" : "outline"}
          size="icon"
          onClick={() => setTransformMode("rotate")}
          className="hover:bg-primary-600 hover:text-white"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant={transformMode === "scale" ? "default" : "outline"}
          size="icon"
          onClick={() => setTransformMode("scale")}
          className="hover:bg-primary-600 hover:text-white"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-x-2 flex items-center">
        <Button
          onClick={onUndo}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRedo}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Redo className="w-4 h-4" />
        </Button>
        <Button
          onClick={onSaveCustomer}
          className="hover:bg-primary-600 hover:text-white"
        >
          Save Design
        </Button>
        <Button
          onClick={onSaveMerchant}
          className="hover:bg-primary-600 hover:text-white"
        >
          Save as Template
        </Button>
        <Button
          onClick={handleLoadClick}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <FolderOpen className="w-4 h-4" />
        </Button>
        <Button
          onClick={onOpenRoomDialog}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Home className="w-4 h-4" />
        </Button>
        <Button
          onClick={onClearAll}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <ThemeToggler />
        <Drawer open={isLoadDrawerOpen} onOpenChange={setIsLoadDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Load Template</DrawerTitle>
              <DrawerDescription>
                Choose a template to load
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[300px] p-4">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className="w-full justify-start mb-2"
                >
                  {template.name} ({template.items} items)
                </Button>
              ))}
            </ScrollArea>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}