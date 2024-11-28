'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from "@/service/api"
import { ProductCategory } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import ProductCategoryFormBase, { ProductCategoryFormData } from './product-category-form-base'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useAccessToken } from '@/hooks/use-access-token'

interface UpdateProductCategoryProps {
  categoryId: string
}

export default function UpdateProductCategoryForm({ categoryId }: UpdateProductCategoryProps) {
  const router = useRouter()
  const { toast } = useToast()

  const accessToken = useAccessToken();

  const productCategoryQuery = useQuery({
    queryKey: ["productCategory", categoryId],
    queryFn: () => api.getById<ProductCategory>(`product-categories`, categoryId, accessToken ?? ''),
  })

  const updateProductCategoryMutation = useMutation({
    mutationFn: (formData: ProductCategoryFormData) => {
      const mappedData = mapFrontendToBackend(formData)
      return api.patch<ProductCategory>(`product-categories/${categoryId}`, mappedData, undefined, accessToken ?? '')
    },
    onSuccess: (data) => {
      toast({
        title: "Category Updated",
        description: "Your product category has been updated successfully.",
      })
      router.push("/manager/product-categories")
    },
    onError: (error) => {
      console.error('Error updating product category:', error)
      toast({
        title: "Error",
        description: "An error occurred while updating the product category. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = async (formData: ProductCategoryFormData) => {
    updateProductCategoryMutation.mutate(formData)
  }

  const mapFrontendToBackend = (frontendData: ProductCategoryFormData): any => {
    return {
      name: frontendData.name,
      description: frontendData.description,
    }
  }

  if (productCategoryQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (productCategoryQuery.isError) {
    return <div>Error loading product category data. Please try again.</div>
  }

  return (
    <section className="max-w-6xl mx-auto">
      <Button variant={'link'} onClick={() => router.push('/merchant/product-categories')} className='p-0'>
        <ArrowLeft size={16}/>
        <span className="ml-2">Back to Product Categories</span>
      </Button>
      <h1 className="text-2xl font-bold my-4">Product Category Management - Update Category</h1>
      <ProductCategoryFormBase 
        initialData={productCategoryQuery.data?.data} 
        onSubmit={handleSubmit} 
        submitButtonText="Update Category" 
      />
    </section>
  )
}