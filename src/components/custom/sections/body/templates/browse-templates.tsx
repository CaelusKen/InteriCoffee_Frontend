import { useState } from 'react'
import TemplateCard from '@/components/custom/cards/default-template-card'

interface Template {
  id: string
  imageUrl: string
  style: string
  creatorName: string
  creatorAvatar: string
  title: string
}

const dummyTemplates: Template[] = [
  {
    id: '1',
    imageUrl: 'https://placehold.co/300x300',
    style: 'Modern',
    creatorName: 'Alice Johnson',
    creatorAvatar: 'https://placehold.co/50x50',
    title: 'Sleek Living Room'
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/300x300',
    style: 'Rustic',
    creatorName: 'Bob Smith',
    creatorAvatar: 'https://placehold.co/50x50',
    title: 'Cozy Bedroom'
  },
  {
    id: '3',
    imageUrl: 'https://placehold.co/300x300',
    style: 'Minimalist',
    creatorName: 'Charlie Brown',
    creatorAvatar: 'https://placehold.co/50x50',
    title: 'Clean Kitchen'
  },
  // Add more dummy templates as needed
]

export default function TemplateGallery() {
  const [templates, setTemplates] = useState<Template[]>(dummyTemplates)

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
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            imageUrl={template.imageUrl}
            style={template.style}
            creatorName={template.creatorName}
            creatorAvatar={template.creatorAvatar}
            title={template.title}
            onSave={() => handleSave(template.id)}
            onViewDetails={() => handleViewDetails(template.id)}
          />
        ))}
      </div>
    </div>
  )
}