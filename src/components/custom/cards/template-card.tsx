/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Coffee, Home, Layers, Maximize2, Sofa } from "lucide-react";
import { TemplateData, TransformUpdate } from "@/types/room-editor";
import SceneContent from "../room-editor/scene-view";

interface TemplateCardProps {
  template: TemplateData;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const TemplateCard = ({ template, onView, onEdit }: TemplateCardProps) => {
  const totalRooms = template.floors.reduce(
    (acc, floor) => acc + floor.rooms.length,
    0
  );
  const totalFurniture = template.floors.reduce(
    (acc, floor) =>
      acc +
      floor.rooms.reduce((roomAcc, room) => roomAcc + room.furniture.length, 0),
    0
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const handleUpdateTransform = (update: TransformUpdate) => {
    // In a real application, you'd update the template state here
    console.log("Update transform:", update);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{template.templateName}</span>
          <Coffee className="h-6 w-6 text-primary" />
        </CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between w-full">
        <div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center">
              <Layers className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">
                {template.floors.length}
              </span>
              <span className="text-xs text-muted-foreground">Floors</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex">
                <Home className="h-5 w-5 mb-1" />
                <Home className="h-5 w-5 mb-1 -ml-2" />
              </div>
              <span className="text-sm font-medium">{totalRooms}</span>
              <span className="text-xs text-muted-foreground">Rooms</span>
            </div>
            <div className="flex flex-col items-center">
              <Sofa className="h-5 w-5 mb-1" />
              <span className="text-sm font-medium">{totalFurniture}</span>
              <span className="text-xs text-muted-foreground">Furnitures</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {template.mainCategories.map((category, index) => (
              <Badge key={index} variant="default">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {template.subCategories.map((category, index) => (
              <Badge key={index} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
          <img src={template.thumbnailImageSrc} alt={template.templateName + ' - ' + template.description} className="w-full h-[260px] object-cover py-2"/>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => onView(template.id)}>
          View
        </Button>
        <Button className="bg-yellow-400 hover:bg-yellow-500" onClick={() => onEdit(template.id)}>Edit</Button>
        <Button>Publish</Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
