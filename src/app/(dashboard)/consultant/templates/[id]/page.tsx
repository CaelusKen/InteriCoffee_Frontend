import ConsultantTemplateDetailsPage from '@/components/custom/sections/body/consultant/template/template-details'
import React from 'react'

export default function ConsultantTemplateDetails({ params }: { params: { id: string } }) {
  return <ConsultantTemplateDetailsPage id={params.id}/>
}
