'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from "@/service/api"
import { Product } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import { ProductFormBase, ProductFormData } from './product-form-base'

export default function CreateProduct() {
  const router = useRouter()
  const { toast } = useToast()

  const createProductMutation = useMutation({
    mutationFn: (formData: ProductFormData) => {
      console.log('Form data before mapping:', JSON.stringify(formData))
      const mappedData = mapFrontendToBackend(formData)
      console.log('Mapped data being sent to API:', JSON.stringify(mappedData, null, 2))
      return api.post<Product>('products', mappedData)
    },
    onSuccess: (data) => {
      console.log('API response:', JSON.stringify(data))
      toast({
        title: "Product Created",
        description: "Your product has been created successfully.",
      })
      router.push("/merchant/products")
    },
    onError: (error) => {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "An error occurred while creating the product. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = async (formData: ProductFormData) => {
    createProductMutation.mutate(formData)
  }

  const mapFrontendToBackend = (frontendData: ProductFormData): any => {
    return {
      name: frontendData.name,
      "category-ids": frontendData.categoryIds,
      description: frontendData.description,
      "true-price": frontendData.sellingPrice,
      discount: frontendData.discount,
      quantity: frontendData.quantity,
      dimensions: frontendData.dimensions,
      materials: frontendData.materials,
      "campaign-id": frontendData.campaignId,
      "merchant-id": frontendData.merchantId,
      status: frontendData.status,
      images: {
        thumbnail: frontendData.thumbnailUrl,
        "normal-images": frontendData.normalImageUrls
      },
      "model-texture-url": frontendData.modelTextureUrl,
    }
  }

  return (
    <section className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold my-2">Product Management - Create New Product</h1>
      <ProductFormBase 
        onSubmit={handleSubmit} 
        submitButtonText="Create Product" 
      />
    </section>
  )
}