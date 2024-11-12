'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/service/api"
import { Product, ProductCategory } from "@/types/frontend/entities"
import { FileUpload } from './file-upload'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { useToast } from "@/hooks/use-toast"
import { storage } from '@/service/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export interface ProductFormData {
  name: string
  categoryIds: string[]
  description: string
  sellingPrice: number
  discount: number
  quantity: number
  dimensions: string
  materials: string[]
  campaignId: string
  merchantId: string
  status: 'ACTIVE' | 'INACTIVE'
  thumbnailUrl?: string
  normalImageUrls?: string[]
  modelTextureUrl?: string
}

interface ProductFormBaseProps {
  initialData?: Product
  onSubmit: (formData: ProductFormData) => Promise<void>
  submitButtonText: string
}

const fetchProductCategories = async (
  page = 1,
  pageSize = 100
): Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>("product-categories", { page, pageSize })
}

export function ProductFormBase({ initialData, onSubmit, submitButtonText }: ProductFormBaseProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    categoryIds: [],
    description: "",
    sellingPrice: 0,
    discount: 0,
    quantity: 0,
    dimensions: "",
    materials: [],
    campaignId: "",
    merchantId: "merchant123",
    status: 'ACTIVE'
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [normalImageFiles, setNormalImageFiles] = useState<File[]>([])
  const [modelTextureFile, setModelTextureFile] = useState<File | null>(null)
  const { toast } = useToast()

  const productCategoriesQuery = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchProductCategories(),
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        categoryIds: initialData.categoryIds || [],
        description: initialData.description,
        sellingPrice: initialData.sellingPrice,
        discount: initialData.sellingPrice - initialData.truePrice,
        quantity: initialData.quantity,
        dimensions: initialData.dimensions,
        materials: initialData.materials,
        campaignId: initialData.campaignId || "",
        merchantId: initialData.merchantId,
        status: initialData.status as 'ACTIVE' | 'INACTIVE',
        thumbnailUrl: initialData.images?.thumbnail,
        normalImageUrls: initialData.images?.normalImages,
        modelTextureUrl: initialData.modelTextureUrl,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['sellingPrice', 'discount', 'quantity'].includes(name) ? Number(value) : value
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  const handleMaterialChange = (material: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      materials: checked
        ? [...prev.materials, material]
        : prev.materials.filter(m => m !== material)
    }))
  }

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedFormData = { ...formData }

      if (thumbnailFile) {
        const thumbnailUrl = await uploadFile(thumbnailFile, `products/${formData.name}/thumbnail`)
        updatedFormData.thumbnailUrl = thumbnailUrl
      }

      if (normalImageFiles.length > 0) {
        const normalImageUrls = await Promise.all(
          normalImageFiles.map((file, index) => 
            uploadFile(file, `products/${formData.name}/normal-${index}`)
          )
        )
        updatedFormData.normalImageUrls = normalImageUrls
      }

      if (modelTextureFile) {
        const modelTextureUrl = await uploadFile(modelTextureFile, `products/${formData.name}/model-texture`)
        updatedFormData.modelTextureUrl = modelTextureUrl
      }

      await onSubmit(updatedFormData)
      toast({
        title: "Success",
        description: "Product submitted successfully.",
      })
    } catch (error) {
      console.error('Error submitting product:', error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the product. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label>Product Categories</Label>
          <div className="space-y-2 mt-2">
            {productCategoriesQuery.data?.data?.items.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={formData.categoryIds.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Product Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="sellingPrice">Selling Price</Label>
          <Input 
            id="sellingPrice" 
            name="sellingPrice" 
            type="number" 
            value={formData.sellingPrice} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            name="quantity" 
            type="number" 
            value={formData.quantity} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input 
            id="dimensions" 
            name="dimensions" 
            value={formData.dimensions} 
            onChange={handleChange} 
            placeholder="e.g., 200cm x 90cm x 85cm"
          />
        </div>
        <div className="col-span-2">
          <Label>Materials</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {['fabric', 'wood', 'foam', 'metal', 'plastic'].map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox 
                  id={`material-${material}`}
                  checked={formData.materials.includes(material)}
                  onCheckedChange={(checked) => handleMaterialChange(material, checked as boolean)}
                />
                <label htmlFor={`material-${material}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {material}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FileUpload
          label="Thumbnail Image"
          accept="image/*"
          onChange={(file: File) => setThumbnailFile(file)}
        />
        <FileUpload
          label="Normal Images"
          accept="image/*"
          multiple
          onChange={(files: File[]) => setNormalImageFiles(files)}
        />
        <FileUpload
          label="Model Texture"
          accept=".glb,.gltf"
          onChange={(file: File) => setModelTextureFile(file)}
        />
      </div>

      <Button type="submit" className="w-full">{submitButtonText}</Button>
    </form>
  )
}