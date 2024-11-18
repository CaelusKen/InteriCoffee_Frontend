import { useEffect, useState } from 'react'
import TemplateCard from '@/components/custom/cards/default-template-card'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { api } from '@/service/api'
import { Merchant, Style, Template } from '@/types/frontend/entities'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import LoadingPage from '@/components/custom/loading/loading'
import { useRouter } from 'next/navigation'

const fetchTemplates = async() : Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated('templates')
}

export default function TemplateGallery() {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const router = useRouter()

  const templateQuery = useQuery({
    queryKey: ['template'],
    queryFn: () => fetchTemplates()
  })

  const templates = templateQuery.data?.data?.items?? []

  const handleSave = (id: string) => {
    console.log(`Saving template with id: ${id}`)
    // Implement save logic here
  }

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details of template with id: ${id}`)
    router.push(`/templates/${id}`)
  }

  if (templateQuery.isLoading) return <LoadingPage />
  if(templateQuery.isError) return <p>Error loading Template</p>

  return (
    <div className="px-8 py-8">
      <span className='flex flex-col mb-4'>
        <h3 className='text-lg sm:text-xl text-left py-2'>
          Template
        </h3>
        <h1 className='text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left py-2'>
          Gallery
        </h1>
      </span>
      <Input type='text' placeholder='Search products here' className='my-4'/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates && templates?.map((template, index) => (
          <TemplateCard
            key={index}
            template={template}
            onSave={() => handleSave(template.id)}
          />
        ))}
      </div>
    </div>
  )
}