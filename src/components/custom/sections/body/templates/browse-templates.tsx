import { useEffect, useState } from 'react'
import TemplateCard from '@/components/custom/cards/default-template-card'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { api } from '@/service/api'
import { Style, Template } from '@/types/frontend/entities'
import { useToast } from '@/hooks/use-toast'

const fetchTemplates = async({ pageNo = 1, pageSize = 10}) : Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated('templates', { pageNo, pageSize })
}

export default function TemplateGallery() {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [templates, setTemplates] = useState<Template[] | null>(null)
  const [styleName, setStyleName] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchTemplates({pageNo, pageSize}).then((res) => {
      if(res.data && res.status == 200) {
        setTemplates(res.data.items)
      }
    }).catch((err) => {
      toast({
        title: 'Fetch Templates fail',
        description: `Template fetching fail at ${err}`,
        className: 'bg-red-500'
      })
    })
  }, [])

  const handleSave = (id: string) => {
    console.log(`Saving template with id: ${id}`)
    // Implement save logic here
  }

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details of template with id: ${id}`)
    // Implement navigation to details page here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Template Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates && templates?.map((template) => (
          <TemplateCard
            key={template.id}
            imageUrl={template.imageUrl}
            style={template?.styleId || 'Anything'}
            creatorName={template.accountId}
            creatorAvatar={'https://github.com/shadcn.png'}
            title={template.name}
            onSave={() => handleSave(template.id)}
            onViewDetails={() => handleViewDetails(template.id)}
          />
        ))}
      </div>
    </div>
  )
}