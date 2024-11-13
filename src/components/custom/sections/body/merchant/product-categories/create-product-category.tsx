'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from "@/service/api"
import { ProductCategory } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import ProductCategoryFormBase, { ProductCategoryFormData } from './product-category-form-base'

const CreateProductCategory = () => {
  const router = useRouter()
  const { toast } = useToast()

  const createProductCategoryMutation = useMutation({
     mutationFn: (formData: ProductCategoryFormData) => {
      const mappedData = mapFrontendToBackend(formData)
      return api.post<ProductCategory>('product-categories', mappedData)
     },
  })

  const mapFrontendToBackend = (frontendData: ProductCategoryFormData): any => {
    return {
      name: frontendData.name,
      description: frontendData.description
    }
  }

  const handleSubmit = async (formData: ProductCategoryFormData) => {
    createProductCategoryMutation.mutate(formData)
  }

  return (
    <section className="max-w-6xl mx-auto">
      <Button variant={'link'} onClick={() => router.push('/merchant/product-categories')} className='p-0'>
        <ArrowLeft size={16}/>
        <h3>Back to List Categories</h3>
      </Button>
      <h1 className="text-2xl font-bold my-2">Product Management - Create New Product</h1>
      <ProductCategoryFormBase 
        onSubmit={handleSubmit} 
        submitButtonText="Create Category" 
      />
    </section>
  )
}

export default CreateProductCategory