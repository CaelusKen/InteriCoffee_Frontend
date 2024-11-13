'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from "@/service/api"
import { Style } from "@/types/frontend/entities"
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import StyleFormBase, { StyleFormData } from './style-form-base'

const CreateStyleForm = () => {
  const router = useRouter()
  const { toast } = useToast()

  const createProductCategoryMutation = useMutation({
     mutationFn: (formData: StyleFormData) => {
      const mappedData = mapFrontendToBackend(formData)
      return api.post<Style>('styles', mappedData)
     },
  })

  const mapFrontendToBackend = (frontendData: StyleFormData): any => {
    return {
      name: frontendData.name,
      description: frontendData.description
    }
  }

  const handleSubmit = async (formData: StyleFormData) => {
    createProductCategoryMutation.mutate(formData)
  }

  return (
    <section className="max-w-6xl mx-auto">
      <Button variant={'link'} onClick={() => router.push('/merchant/styles')} className='p-0'>
        <ArrowLeft size={16}/>
        <h3>Back to List Styles</h3>
      </Button>
      <h1 className="text-2xl font-bold my-2">Style - Create New Style</h1>
      <StyleFormBase 
        onSubmit={handleSubmit} 
        submitButtonText="Create Style" 
      />
    </section>
  )
}

export default CreateStyleForm