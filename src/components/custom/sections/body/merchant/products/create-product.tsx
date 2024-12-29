'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from "@/service/api"
import { Account, Product } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import { ProductFormBase, ProductFormData } from './product-form-base'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useAccessToken } from '@/hooks/use-access-token'

export default function CreateProduct() {
  const router = useRouter()
  const { toast } = useToast()

  const accessToken = useAccessToken()

  const { data: session, status: sessionStatus } = useSession();
  
  const { data: accountInfo, isLoading, error } = useQuery({
    queryKey: ['account', session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) throw new Error('No email found in session')
      const response = await api.get(`accounts/${encodeURIComponent(session.user.email)}/info`, undefined, accessToken ?? '')
      return mapBackendToFrontend<Account>(response.data, 'account')
    },
    enabled: !!session?.user?.email,
  })

  const createProductMutation = useMutation({
    mutationFn: (formData: ProductFormData) => {
      const mappedData = mapFrontendToBackend(formData)
      return api.post<Product>('products', mappedData, accessToken ?? '')
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully!",
        className: "bg-green-500",
      })
      router.push('/merchant/products')
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
      "merchant-id": accountInfo?.merchantId,
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
      <Button variant={'link'} onClick={() => router.push('/merchant/products')} className='p-0'>
        <ArrowLeft size={16}/>
        <h3>Back to List Product</h3>
      </Button>
      <h1 className="text-2xl font-bold my-2">Product Management - Create New Product</h1>
      <ProductFormBase 
        onSubmit={handleSubmit} 
        submitButtonText="Create Product" 
      />
    </section>
  )
}