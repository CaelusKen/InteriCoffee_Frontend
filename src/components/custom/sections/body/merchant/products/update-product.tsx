"use client"

import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { api } from "@/service/api"
import { Product, ProductCategory } from "@/types/frontend/entities"
import { FileUpload } from './file-upload'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface ProductFormData {
  name: string
  categoryId: string
  description: string
  sellingPrice: number
  discount: number
  quantity: number
  dimensions: string
  materials: string[]
  campaignId: string
  merchantId: string
  status: 'ACTIVE' | 'INACTIVE'
}

const fetchProductCategories = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>("product-categories", { page, pageSize })
}

const fetchProduct = async (id: string): Promise<ApiResponse<Product>> => {
  return api.get<Product>(`products/${id}`)
}

interface MerchantUpdateProductFormProps {
  productId: string
}

export function MerchantUpdateProductForm({ productId }: MerchantUpdateProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    categoryId: "",
    description: "",
    sellingPrice: 0,
    discount: 0,
    quantity: 0,
    dimensions: "",
    materials: [],
    campaignId: "",
    merchantId: "merchant123", // This should be dynamically set based on the logged-in merchant
    status: 'ACTIVE'
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [normalImageFiles, setNormalImageFiles] = useState<File[]>([])
  const [modelTextureFile, setModelTextureFile] = useState<File | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const { toast } = useToast()

  const [page, setPage] = useState(1)

  const productCategoriesQuery = useQuery({
    queryKey: ["productCategories", page],
    queryFn: () => fetchProductCategories(page),
  })

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  })

  const categories = productCategoriesQuery.data?.data?.items ?? []

  useEffect(() => {
    if (productQuery.data?.data) {
      const product = productQuery.data.data
      setFormData({
        name: product.name,
        categoryId: product["categoryIds"][0],
        description: product.description,
        sellingPrice: product["sellingPrice"],
        discount: product["sellingPrice"] - product["truePrice"],
        quantity: product.quantity,
        dimensions: product.dimensions,
        materials: product.materials,
        campaignId: product["campaignId"],
        merchantId: product["merchantId"],
        status: product.status.match("INACTIVE") ? "ACTIVE" : "INACTIVE",
      })
    }
  }, [productQuery.data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['sellingPrice', 'discount', 'quantity'].includes(name) ? Number(value) : value
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)

    try {
      // Validate required fields
      if (!formData.name || !formData.categoryId || !formData.description || !formData.sellingPrice) {
        setAlertMessage("Please fill in all required fields.")
        setShowAlert(true)
        return
      }

      // Prepare the data for API submission
      const productData = {
        ...formData,
        "category-id": [formData.categoryId],
        "selling-price": formData.sellingPrice,
        "true-price": formData.sellingPrice - formData.discount,
        images: {
          thumbnail: thumbnailFile ? URL.createObjectURL(thumbnailFile) : "",
          "normal-images": normalImageFiles.map(file => URL.createObjectURL(file))
        },
        "model-texture-url": modelTextureFile ? URL.createObjectURL(modelTextureFile) : "",
        "campaign-id": formData.campaignId,
        "merchant-id": formData.merchantId
      }

      // Update product
      const response = await api.patch<Product>(`products/${productId}`, productData)
      console.log('Product updated successfully:', response)

      // Show success message
      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully.",
      })

    } catch (error) {
      console.error('Error updating product:', error)
      setAlertMessage("An error occurred while updating the product. Please try again.")
      setShowAlert(true)
    }
  }

  if (productQuery.isLoading) {
    return <div>Loading product data...</div>
  }

  if (productQuery.isError) {
    return <div>Error loading product data. Please try again.</div>
  }

  return (
    <section className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold my-2">Product Management - Update Product</h1>
      <h3 className="text-sm font-medium mb-4">Please complete the form to update Product</h3>
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
            <Label htmlFor="category">Product Category</Label>
            <Select onValueChange={handleCategoryChange} value={formData.categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <div className="flex items-center space-x-2">
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Selling price information</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This price will be updated according to the Terms of Service of the application.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            accept="image/*"
            onChange={(file: File) => setModelTextureFile(file)}
          />
        </div>

        <Button type="submit" className="w-full">Update Product</Button>
      </form>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}