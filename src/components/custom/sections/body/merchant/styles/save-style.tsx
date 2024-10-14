"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SceneContent from '@/components/custom/room-editor/scene-view'
import { Badge } from "@/components/ui/badge"
import { X, Plus } from 'lucide-react'
import { Room, Furniture, MainCategory, SubCategory, TemplateData } from '@/types/room-editor'

const MAIN_CATEGORIES: MainCategory[] = [
  "Minimalist", "Vintage", "Modern", "Industrial", "Scandinavian", "Bohemian", "Contemporary", "Traditional"
];

export default function SaveTemplatePage() {
  const [templateName, setTemplateName] = useState('')
  const [description, setDescription] = useState('')
  const [templateData, setTemplateData] = useState<TemplateData | null>(null)
  const [highlightImages, setHighlightImages] = useState<string[]>([])
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [newSubCategory, setNewSubCategory] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const savedTemplate = localStorage.getItem('savingTemplate')
    if (savedTemplate) {
      const parsedTemplate = JSON.parse(savedTemplate) as TemplateData
      setTemplateData(parsedTemplate)
      generateSubCategories(parsedTemplate.furniture)
    }
  }, [])

  const generateSubCategories = (furniture: Furniture[]) => {
    const generatedSubCategories = new Set<SubCategory>()
    furniture.forEach(item => {
      if (item.characteristics) {
        item.characteristics.forEach(char => generatedSubCategories.add(char))
      }
    })
    setSubCategories(Array.from(generatedSubCategories))
  }

  const handleSave = () => {
    if (!templateData) {
      alert('No template data found!')
      return
    }

    const fullTemplate: TemplateData = {
      ...templateData,
      mainCategories,
      subCategories,
    }

    localStorage.setItem('savedMerchantTemplate', JSON.stringify(fullTemplate))
    alert('Template saved successfully!')
    const existingTemplates = JSON.parse(localStorage.getItem('merchantTemplates') || '[]');
    existingTemplates.push(fullTemplate);
    localStorage.setItem('merchantTemplates', JSON.stringify(existingTemplates));
    router.push('/merchant/styles')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setHighlightImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setHighlightImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleMainCategoryChange = (category: MainCategory) => {
    setMainCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const handleSubCategoryChange = (category: SubCategory) => {
    setSubCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const addNewSubCategory = () => {
    if (newSubCategory && !subCategories.includes(newSubCategory)) {
      setSubCategories(prev => [...prev, newSubCategory])
      setNewSubCategory('')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-[1600px]">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Save Design Template</CardTitle>
          <CardDescription>Provide details for your design template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter a name for your template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your template"
                />
              </div>
              <div className="space-y-2">
                <Label>Main Categories (Interior Design Styles)</Label>
                <div className="flex flex-wrap gap-2">
                  {MAIN_CATEGORIES.map(category => (
                    <Badge
                      key={category}
                      variant={mainCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleMainCategoryChange(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sub Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {subCategories.map(category => (
                    <Badge
                      key={category}
                      variant={subCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSubCategoryChange(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="New sub-category"
                  />
                  <Button onClick={addNewSubCategory} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlightImages">Highlight Images</Label>
                <div className="flex flex-wrap gap-2">
                  {highlightImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Highlight ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-20 h-20"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Add image"
                  >
                    +
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    placeholder='+'
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Label>Style Preview</Label>
              <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                {templateData && (
                  <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
                    <SceneContent
                      room={templateData.room}
                      furniture={templateData.furniture}
                      selectedItem={null}
                      onSelectItem={() => {}}
                      onUpdateTransform={() => {}}
                      transformMode="translate"
                    />
                    <OrbitControls />
                  </Canvas>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} className="w-full">Save Template</Button>
        </CardFooter>
      </Card>
    </div>
  )
}