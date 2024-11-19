"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bookmark, Box, Eye } from "lucide-react";
import FloorSelector from "./inputs/floor-selector";
import RoomSelector from "./inputs/room-selector";
import ModelViewer from "./inputs/room-preview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ColorCard from "@/components/custom/cards/color-card";
import { Merchant, Style, Template } from "@/types/frontend/entities";
import { ApiResponse } from "@/types/api";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "../consultant/template/template-details";
import { useSession } from "next-auth/react";

const fetchTemplateById = async (
  id: string
): Promise<ApiResponse<Template>> => {
  return api.getById<Template>("templates", id);
};

const fetchStyleById = async (id: string): Promise<ApiResponse<Style>> => {
  return api.getById<Style>("styles", id);
};

const fetchMerchantById = async (
  id: string
): Promise<ApiResponse<Merchant>> => {
  return api.getById("merchants", id);
};

interface TemplateDetailsProps {
  id: string;
}

export default function TemplateDetailsBody({ id }: TemplateDetailsProps) {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("living_room");
  const [merchant, setMerchant] = useState<string | null>(null);

  const [dialogWarning, setDialogWarning] = useState(false);
  const [sketchWarning, setSketchWarning] = useState(false);

  const { toast } = useToast()

  const router = useRouter()

  const { data: session } = useSession()

  const getMerchantById = (id: string) => {
    fetchMerchantById(id).then((res) => {
      if (res.status === 200) {
        setMerchant(res.data.name);
      } else throw new Error("Failed to fetch merchant");
    });
    return merchant;
  };

  const templateQuery = useQuery({
    queryKey: ["template", id],
    queryFn: () => fetchTemplateById(id),
    enabled: !!id,
  });

  const template = templateQuery.data?.data;

  const styleQuery = useQuery({
    queryKey: ["style", template?.styleId],
    queryFn: () => fetchStyleById(template?.styleId || ""),
    enabled: !!template?.styleId,
  });

  const style = styleQuery.data?.data.name;

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
  };

  const handleUseTemplateAsDesign = () => {
    setDialogWarning(false);
    if (template?.type.match("Sketch")) {
      setSketchWarning(true);
    }
  };

  const handleSaveToCollection = () => {
    console.log("Saved to collection:", id);

    toast({
      title: "Template saved to collection",
      description: "Your template has been successfully saved to your collections.",
      className: "bg-green-500"
    })
  }

  const toggleDialogWarning = () => {
    setDialogWarning(!dialogWarning);
  };

  if (templateQuery.isLoading) {
    return <div>Loading template details...</div>;
  }

  if (templateQuery.isError) {
    return <div>Error loading template details. Please try again.</div>;
  }

  return (
    <main className="container mx-auto px-8 py-4">
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.25 }}
        className="flex justify-between gap-4 text-center mb-12 pr-8"
      >
        <Button variant={'ghost'} onClick={() => router.back()}>
          <ArrowLeft size={24}/>
          Return
        </Button>
        {/* For actions */}
        <div className="flex gap-4">
          <TooltipProvider>
            { session?.user.role === "CUSTOMER" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size={"icon"} onClick={handleSaveToCollection}>
                    <Bookmark size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save to Collections</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={"icon"}
                  onClick={toggleDialogWarning}
                >
                  <Box size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use as template</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5 }}
        className="flex flex-col gap-4 text-center mb-12"
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <h3 className="text-sm sm:text-base">Template Details</h3>
          <p>-</p>
          <h3 className="text-sm sm:text-base">
            Created on: {formatDate(template?.createdDate)}
          </h3>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-primary">
          {template?.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Created by: <Link href={`/merchants/${template?.merchantId}`}>{getMerchantById(template?.merchantId || "")}</Link>
        </p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>0 views</span> {/* This will be updated in another way */}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.7 }}
        className="mb-12"
      >
        <Card className="overflow-hidden">
          <img
            src={template?.imageUrl}
            alt={template?.name}
            className="w-full h-[400px] object-cover"
          />
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.9 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Style and Categories</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {style}
          </Badge>
          {template?.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-lg px-4 py-2">
              {category}
            </Badge>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {template?.products.map((product, index) => (
            <ProductCard key={index} productId={product.id} quantity={product.quantity} />
          ))}
        </div>
      </motion.section>

      {/* <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Color Palette</h2>
        <div className="flex gap-4">
          {colorPalette.map((color, index) => (
            <ColorCard hexColor={color} key={index}/>
          ))}
        </div>
      </motion.section> */}

      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground">
              {template?.description}
            </p>
          </CardContent>
        </Card>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-8">3D Preview</h2>
        {template?.type.match("Template") && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <FloorSelector
                selectedFloor={selectedFloor}
                onSelectFloor={setSelectedFloor}
              />
              <div className="mt-8">
                <RoomSelector
                  selectedRoom={selectedRoom}
                  onSelectRoom={setSelectedRoom}
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <ModelViewer floor={selectedFloor} room={selectedRoom} />
            </div>
          </div>
        )}
        {(template?.type.match("Sketch") || template?.type.match("TEST")) && (
            <Card>
              <CardContent className="p-6">
                <p className="text-lg text-muted-foreground">
                  This is a sketch, merchants will update the details soon.
                </p>
              </CardContent>
            </Card>
          )}
      </motion.section>

      <Dialog open={dialogWarning} onOpenChange={setDialogWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use as a template</DialogTitle>
            <DialogDescription>
              Are you sure you want to use this template to your design?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDialogWarning(false)}>
              Cancel
            </Button>
            <Button onClick={handleUseTemplateAsDesign}>Use it</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={sketchWarning} onOpenChange={setSketchWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sketch Template Warning</DialogTitle>
            <DialogDescription>
              The merchant has not provided a sketch for this template yet. Some
              features may be limited.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setSketchWarning(false)}>Understood</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
