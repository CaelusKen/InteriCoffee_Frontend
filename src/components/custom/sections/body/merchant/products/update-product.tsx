'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from "@/service/api"
import { Account, Product } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import { ProductFormBase, ProductFormData } from './product-form-base'
import { useSession } from 'next-auth/react'

interface UpdateProductProps {
  productId: string
}

export default function UpdateProduct({ productId }: UpdateProductProps) {
  const router = useRouter()
  const { toast } = useToast()

  const { data: session, status: sessionStatus } = useSession()

  const { data: accountInfo } = useQuery({
    queryKey: ['account', session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) throw new Error('No email found in session')
      return api.get<Account>(`accounts/${encodeURIComponent(session.user.email)}/info`)
    },
    enabled: !!session?.user?.email,
  })

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.getById<Product>(`products`, productId),
  })

  const updateProductMutation = useMutation({
    mutationFn: (formData: ProductFormData) => {
      const mappedData = mapFrontendToBackend(formData)
      return api.patch<Product>(`products/${productId}`, mappedData)
    },
    onSuccess: (data) => {
      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully.",
        variant: "destructive",
      })
      router.push("/merchant/products")
    },
    onError: (error) => {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "An error occurred while updating the product. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = async (formData: ProductFormData) => {
    updateProductMutation.mutate(formData)
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
      "merchant-id": accountInfo?.data.merchantId,
      status: frontendData.status,
      images: {
        thumbnail: frontendData.thumbnailUrl,
        "normal-images": frontendData.normalImageUrls
      },
      "model-texture-url": frontendData.modelTextureUrl,
    }
  }

  if (productQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (productQuery.isError) {
    return <div>Error loading product data. Please try again.</div>
  }

  return (
    <section className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold my-2">Product Management - Update Product</h1>
      <ProductFormBase 
        initialData={productQuery.data?.data} 
        onSubmit={handleSubmit} 
        submitButtonText="Update Product" 
      />
    </section>
  )
}