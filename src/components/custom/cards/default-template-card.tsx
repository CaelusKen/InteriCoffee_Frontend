'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Eye } from 'lucide-react'
import { ApiResponse } from "@/types/api"
import { Style, Template } from "@/types/frontend/entities"
import { api } from "@/service/api"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

const fetchStyleNameById = async(id: string) : Promise<ApiResponse<Style>> => {
  return api.getById<Style>('styles', id)
}

interface TemplateCardProps {
  template: Template
  onSave: () => void
  onViewDetails: () => void
}

export default function TemplateCard({
  template,
  onSave,
  onViewDetails
}: TemplateCardProps) {
  const [styleName, setStyleName] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
     fetchStyleNameById(template.styleId).then((res) => {
        setStyleName(res.data.name)
     }).catch((err) => {
        toast({
          title: 'Error fetching style',
          description: `Error fetching style for template at ${err}`,
          className: 'bg-red-500'
        })
     })
  })

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/25">
      <div className="relative aspect-square">
        <img
          src={template.imageUrl}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
        >
          {styleName}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
          <Badge className={`${template.type.match("Sketch") ? 'bg-yellow-500': 'bg-green-500'}`}>
            {template.type.match("Sketch") ? "Sketch" : "Template"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={'https://github.com/shadcn.png'}
            alt={'Avatar'}
            className="w-[24px] h-[24px] object-cover rounded-full"
          />
          <span className="text-sm text-muted-foreground">{template.accountId}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onSave}>
          <Bookmark className="w-4 h-4 mr-2" />
          Save To Collection
        </Button>
        <Button variant="secondary" size="sm" onClick={onViewDetails}>
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}