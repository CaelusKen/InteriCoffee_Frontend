import TemplateDetailsBody from '@/components/custom/sections/body/templates/template-details'
import React from 'react'

export default function TemplateDetailsPage({ params }: {params: {id: string}}) {
  return (
    <TemplateDetailsBody id={params.id}/>
  )
}
