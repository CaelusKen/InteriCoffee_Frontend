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
import { Account, Product, ProductCategory } from "@/types/frontend/entities"
import { FileUpload } from './file-upload'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { useToast } from "@/hooks/use-toast"
import { storage } from '@/service/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useAccessToken } from '@/hooks/use-access-token'

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

const fetchProductCategories = async (accessToken: string): Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>("product-categories", undefined, accessToken)
}

export function ProductFormBase({ initialData, onSubmit, submitButtonText }: ProductFormBaseProps) {
  const { data: session, status: sessionStatus } = useSession();

  const accessToken = useAccessToken();
  
  const { data: accountInfo, isLoading, error } = useQuery({
    queryKey: ['account', session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) throw new Error('No email found in session')
      const response = await api.get(`accounts/${encodeURIComponent(session.user.email)}/info`)
      return mapBackendToFrontend<Account>(response.data, 'account')
    },
    enabled: !!session?.user?.email,
  })

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
    merchantId: accountInfo?.merchantId || 'merchant123',
    status: 'ACTIVE'
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [normalImageFiles, setNormalImageFiles] = useState<File[]>([])
  const [modelTextureFile, setModelTextureFile] = useState<File | null>(null)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const productCategoriesQuery = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchProductCategories(accessToken ?? ''),
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
        merchantId: accountInfo?.merchantId|| initialData.merchantId,
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
    setIsSubmitting(true)
    try {
      const updatedFormData = { ...formData}
      
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
        const fileExtension = modelTextureFile.name.split('.').pop()?.toLowerCase();
        if (fileExtension === 'glb' || fileExtension === 'gltf') {
          const modelTextureUrl = await uploadFile(modelTextureFile, `products/${formData.name}/model-texture`);
          updatedFormData.modelTextureUrl = modelTextureUrl;
        } else {
          toast({
            title: "Invalid File Type",
            description: "Please upload a .glb or .gltf file for the 3D model.",
            variant: "destructive",
          });
          return;
        }
      }

      await onSubmit(updatedFormData)
      setIsSuccess(true)
      toast({
        title: "Success",
        description: "Product submitted successfully.",
      })
      setTimeout(() => {
        router.push('/merchant/products')
      }, 2000)
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
    <form onSubmit={handleSubmit} className="">
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
          <div className="flex flex-wrap gap-4 items-center w-full mt-4">
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
        <div className='flex justify-between gap-4'>
          <div className='w-full'>
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
          <div className='w-full '>
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
        <div className="col-span-2 my-4">
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

      <div className="grid grid-cols-2 justify-items-stretch">
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
          accept=".glb"
          onChange={(file: File) => setModelTextureFile(file)}
        />
      </div>

      <div className="flex justify-end items-center space-x-4">
        {isSuccess && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2" />
            <span>Submission successful!</span>
          </div>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || isSuccess}
          className="w-40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isSuccess ? (
            "Redirecting..."
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  )
}