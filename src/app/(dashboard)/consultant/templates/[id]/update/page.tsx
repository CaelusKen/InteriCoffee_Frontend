import ConsultantEditTemplate from '@/components/custom/sections/body/consultant/template/edit-template'
import React from 'react'

export default function ConsultantEditTemplatePage({ params }: { params: { id: string }}) {
  return <ConsultantEditTemplate id={params.id}/>
}
