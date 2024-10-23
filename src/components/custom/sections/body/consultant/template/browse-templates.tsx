'use client'

import React, { useState, useEffect } from 'react'
import TemplateCard from '@/components/custom/cards/template-card'
import { useRouter } from 'next/navigation'
import { TemplateData } from '@/types/room-editor'
import { Button } from '@/components/ui/button'
import { Plus, PlusCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const ConsultantBrowseTemplatePage = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateData[]>([])

  useEffect(() => {
    const loadTemplates = () => {
      try {
        const storedTemplates = localStorage.getItem('merchantTemplates')
        if (storedTemplates) {
          const parsedTemplates = JSON.parse(storedTemplates) as TemplateData[]
          setTemplates(parsedTemplates)
        } else {
          setTemplates([])
          toast({
            title: "No templates found",
            description: "You haven't created any templates yet.",
            variant: "default",
          })
        }
      } catch (error) {
        console.error('Error loading templates:', error)
        toast({
          title: "Error",
          description: "There was an error loading your templates. Please try again.",
          variant: "destructive",
        })
        setTemplates([])
      }
    }

    loadTemplates()
  }, [])

  const handleCreateTemplate = () => {
    router.push('/consultant/templates/create');
  }

  const handleViewTemplateDetails = (id: string) => {
    router.push(`/consultant/templates/${id}`);
  }

  const handleEditTemplateDetails = (id: string) => {
    router.push(`/consultant/templates/edit/${id}`);
  }
  
  return (
    <section className='py-4'>
      <div className='flex itemscenter justify-between'>
        <h1 className='font-bold uppercase text-2xl'>Your template designs</h1>
        <Button className='bg-green-500 hover:bg-green-600' onClick={() => handleCreateTemplate()}>
          <span className='flex gap-2'>
            <PlusCircle size={24}/>
            <p>Create a Template</p>
          </span>
        </Button>
      </div>
      <section className='flex flex-col gap-6 mt-4'>
        {templates.map((template, index) => (
          <TemplateCard 
            key={index}
            template={template}
            onEdit={() => handleEditTemplateDetails(template.id)}
            onView={() => handleViewTemplateDetails(template.id)}
          />
        ))
        }
      </section>
    </section>
  )
}

export default ConsultantBrowseTemplatePage