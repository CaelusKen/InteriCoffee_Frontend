'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from "@/service/api"
import { Style } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import StyleFormBase, { StyleFormData } from './style-form-base'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface UpdateStyleProps {
  styleId: string
}

export default function UpdateStyleForm({ styleId }: UpdateStyleProps) {
  const router = useRouter()
  const { toast } = useToast()

  const styleQuery = useQuery({
    queryKey: ["style", styleId],
    queryFn: () => api.getById<Style>(`styles`, styleId),
  })

  const updateStyleMutation = useMutation({
    mutationFn: (formData: StyleFormData) => {
      const mappedData = mapFrontendToBackend(formData)
      return api.patch<Style>(`styles/${styleId}`, mappedData)
    },
    onSuccess: (data) => {
      toast({
        title: `Style Updated`,
        description: "Your style has been updated successfully.",
      })
      router.push("/merchant/styles")
    },
    onError: (error) => {
      console.error('Error updating style:', error)
      toast({
        title: "Error",
        description: "An error occurred while updating the style. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = async (formData: StyleFormData) => {
    updateStyleMutation.mutate(formData)
  }

  const mapFrontendToBackend = (frontendData: StyleFormData): any => {
    return {
      name: frontendData.name,
      description: frontendData.description,
    }
  }

  if (styleQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (styleQuery.isError) {
    return <div>Error loading product category data. Please try again.</div>
  }

  return (
    <section className="max-w-6xl mx-auto">
      <Button variant={'link'} onClick={() => router.push('/merchant/product-categories')} className='p-0'>
        <ArrowLeft size={16}/>
        <span className="ml-2">Back to Styles</span>
      </Button>
      <h1 className="text-2xl font-bold my-4">Style Management - Update Style</h1>
      <StyleFormBase 
        initialData={styleQuery.data?.data} 
        onSubmit={handleSubmit} 
        submitButtonText="Update Style" 
      />
    </section>
  )
}