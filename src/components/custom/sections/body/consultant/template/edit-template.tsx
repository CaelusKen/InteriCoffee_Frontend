'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Style, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '../../merchant/products/file-upload'
import { SingleSelectBadge } from './create-template/single-select-badge'
import { useAccessToken } from '@/hooks/use-access-token'

interface ConsultantEditTemplate {
  id: string
}

const fetchTemplateById = async(id: string, accessToken: string) : Promise<ApiResponse<Template>> => {
  return api.getById<Template>('templates', id, accessToken)
}

const fetchStyles = async(accessToken: string): Promise<ApiResponse<PaginatedResponse<Style>>> => {
  return api.getPaginated<Style>('styles', undefined, accessToken)
}

const ConsultantEditTemplate = ({id} : ConsultantEditTemplate) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  const accessToken = useAccessToken()

  const stylesQuery = useQuery({
    queryKey: ['styles'],
    queryFn: () => fetchStyles(accessToken ?? ''),
    refetchInterval: 60 * 1000,
    enabled: true
  })
  
  const templateQuery = useQuery({
    queryKey: ['templates', { id }],
    queryFn: () => fetchTemplateById(id, accessToken ?? ''),
    refetchInterval: 60 * 1000,
    enabled: !!id
  })

  const template = templateQuery.data?.data

  const styles = stylesQuery.data?.data.items || []

  const handleStyleSelect = (style: Style | null) => {
    setSelectedStyle(style ? style.id : null)
  }

  return (
    <div>
      <Tabs defaultValue="edit" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="edit-information">Edit Template Information</TabsTrigger>
          <TabsTrigger value="edit-modelView">Edit Template Model View</TabsTrigger>
        </TabsList>
        <TabsContent value="edit-information">
          <section className='grid grid-cols-2 gap-4 w-[1200px]'>
            <div>
              <Label>Template Name</Label>
              <Input type="text" value={template?.name || ''} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={template?.description || ''} rows={4}/>
            </div>
            <div>
              <FileUpload 
                accept='image/*'
                label='Upload Template Image'
                onChange={() => {}}
              />
            </div>
            <div>
              <Label>Style</Label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <SingleSelectBadge
                    key={style.id}
                    style={style}
                    isActive={selectedStyle === style.id}
                    onSelect={() => handleStyleSelect(style)}
                  />
                ))}
              </div>
            </div>
          </section>
        </TabsContent>
        <TabsContent value="edit-modelView">
          Edit your template 3D view here
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConsultantEditTemplate