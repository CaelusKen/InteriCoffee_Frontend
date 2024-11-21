/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SceneContent from '@/components/custom/room-editor/scene-view'
import { Badge } from "@/components/ui/badge"
import { X, Plus } from 'lucide-react'
import { Room, Furniture, MainCategory, SubCategory, TemplateData, Floor } from '@/types/room-editor'

export default function ConsultantSaveTemplatePage() {
  

  return (
    <div className="container mx-auto p-4 max-w-[1600px]">
      
    </div>
  )
}