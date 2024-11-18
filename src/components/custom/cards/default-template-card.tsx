'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Eye } from 'lucide-react'
import { ApiResponse } from "@/types/api"
import { Merchant, Style, Template } from "@/types/frontend/entities"
import { api } from "@/service/api"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const fetchStyleNameById = async(id: string) : Promise<ApiResponse<Style>> => {
  return api.getById<Style>('styles', id)
}

const fetchMerchantById = async(id: string): Promise<ApiResponse<Merchant>> => {
  return api.getById('merchants', id)
}

interface TemplateCardProps {
  template: Template
  onSave: () => void
}

export default function TemplateCard({
  template,
  onSave,
}: TemplateCardProps) {
  const [styleName, setStyleName] = useState<string | null>(null)

  const [merchant, setMerchant] = useState<string | null>(null)

  const { toast } = useToast()

  const getMerchantById = (id: string) => {
    fetchMerchantById(id).then((res) => {
      if(res.status === 200) {
        setMerchant(res.data.name)
      }
      else throw new Error('Failed to fetch merchant')
    })
    return merchant
  }

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

  const router = useRouter()

  return (
    <Card className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/25">
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
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{template.name}</h3>
          <Badge className={`${template.type.match("Sketch") ? 'bg-yellow-500': 'bg-green-500'} whitespace-nowrap`}>
            {template.type.match("Sketch") ? "Sketch" : "Template"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={'https://github.com/shadcn.png'}
            alt={'Avatar'}
            className="w-[24px] h-[24px] object-cover rounded-full"
          />
          <span className="text-xs sm:text-sm text-muted-foreground truncate">{getMerchantById(template.merchantId)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={onSave}>
          <Bookmark className="w-4 h-4 mr-2" />
          <span className="whitespace-nowrap">Save To Collection</span>
        </Button>
        <Button variant="secondary" size="sm" className="w-full sm:w-auto" onClick={() => router.push(`/templates/${template.id}`)}>
          <Eye className="w-4 h-4 mr-2" />
          <span className="whitespace-nowrap">View Details</span>
        </Button>
      </CardFooter>
    </Card>
  )
}