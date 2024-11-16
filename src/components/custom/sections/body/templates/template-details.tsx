"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import FloorSelector from "./inputs/floor-selector";
import RoomSelector from "./inputs/room-selector";
import ModelViewer from "./inputs/room-preview";
import ColorCard from "@/components/custom/cards/color-card";

interface TemplateDetailsProps {
  name: string;
  description: string;
  imageUrl: string;
  featuredProducts: string[];
  style: string;
  customCategories: string[];
  colorPalette: string[];
  usage: string;
  viewCount: number;
  createdAt: string;
}

export default function TemplateDetailsBody(
  {
    name,
    description,
    imageUrl,
    featuredProducts,
    style,
    customCategories,
    colorPalette,
    usage,
    viewCount,
    createdAt,
  }: TemplateDetailsProps
) {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("living_room");

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.5 }}
        className="flex flex-col gap-4 text-center mb-12"
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <h3 className="text-sm sm:text-base">Template Details</h3>
          <p>-</p>
          <h3 className="text-sm sm:text-base">Created on: {createdAt}</h3>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-primary">
          {name}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>{viewCount} views</span>
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
            src={imageUrl}
            alt={name}
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
          {customCategories.map((category, index) => (
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
        <div className="flex flex-wrap gap-2">
          {featuredProducts.map((product, index) => (
            <Badge key={index} variant="outline" className="text-lg px-4 py-2">
              {product}
            </Badge>
          ))}
        </div>
      </motion.section>

      <motion.section
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
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 1.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Usage</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-lg text-muted-foreground">{usage}</p>
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
      </motion.section>
    </main>
  );
}
