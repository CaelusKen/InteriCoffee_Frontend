'use client'

import CustomerDesignDetails from '@/components/custom/user/design/design-details'
import { useParams } from 'next/navigation'
import React from 'react'

export default function DesignDetailsPage() {
    const params = useParams()
    const id = params.id as string

  return (
    <CustomerDesignDetails id={id} />
  )
}
