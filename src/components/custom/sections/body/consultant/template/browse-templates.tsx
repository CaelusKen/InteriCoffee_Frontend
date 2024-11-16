'use client'

import React, { useState, useEffect } from 'react'
import TemplateCard from '@/components/custom/cards/template-card'
import { useRouter } from 'next/navigation'
import { TemplateData } from '@/types/room-editor'
import { Button } from '@/components/ui/button'
import { Plus, PlusCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import ConsultantTemplateCard from '@/components/custom/cards/consultant-template-card'

//Dummy data
const dummyData = [
  {
    name: "Modern Living Room",
    description: "A sleek and contemporary living room design",
    imageUrl: "/placeholder.svg?height=200&width=300",
    featuredProducts: ["Sofa", "Coffee Table", "Floor Lamp"],
    style: "Contemporary",
    customCategories: ["Minimalist", "Urban"],
    colorPalette: ["#F5E6D3", "#A8C69F", "#3D405B", "#81B29A"],
    usage: "Perfect for open-concept apartments and modern homes",
    viewCount: 1234,
    isSketch: false
  },
  {
    name: "Cozy Bedroom",
    description: "A warm and inviting bedroom design",
    imageUrl: "/placeholder.svg?height=200&width=300",
    featuredProducts: ["Bed", "Nightstand", "Reading Lamp"],
    style: "Scandinavian",
    customCategories: ["Hygge", "Minimalist"],
    colorPalette: ["#E8D5C4", "#7C9885", "#414535", "#A67F5D"],
    usage: "Ideal for creating a relaxing and comfortable sleeping space",
    viewCount: 987,
    isSketch: false
  },
  {
    name: "Industrial Kitchen",
    description: "A bold and functional kitchen design",
    imageUrl: "/placeholder.svg?height=200&width=300",
    featuredProducts: ["Island", "Bar Stools", "Pendant Lights"],
    style: "Industrial",
    customCategories: ["Modern", "Urban"],
    colorPalette: ["#D5D5D5", "#2B2B2B", "#E0A800", "#575757"],
    usage: "Great for loft apartments and open-plan living spaces",
    viewCount: 1567,
    isSketch: false
  },
  {
    name: "Rustic Dining Room Sketch",
    description: "A warm and inviting dining room concept",
    imageUrl: "/placeholder.svg?height=200&width=300",
    featuredProducts: ["Dining Table", "Chairs", "Chandelier"],
    style: "Rustic",
    customCategories: ["Farmhouse", "Traditional"],
    colorPalette: [],
    usage: "",
    viewCount: 456,
    isSketch: true
  }
]

const ConsultantBrowseTemplatePage = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateData[]>([])

  const [dummyTemplate, setDummyTemplate] = useState(dummyData)

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
      <section className='flex flex-col gap-4 mt-4'>
        {/* {templates.map((template, index) => (
          <TemplateCard 
            key={index}
            template={template}
            onEdit={() => handleEditTemplateDetails(template.id)}
            onView={() => handleViewTemplateDetails(template.id)}
          />
        ))
        } */}
        {dummyData.map((template, index) => (
          <ConsultantTemplateCard key={index} {...template} />
        ))}
      </section>
    </section>
  )
}

export default ConsultantBrowseTemplatePage