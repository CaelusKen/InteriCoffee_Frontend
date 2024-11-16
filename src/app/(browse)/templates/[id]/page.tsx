import TemplateDetailsBody from '@/components/custom/sections/body/templates/template-details'
import React from 'react'

const templateData = {
    name: "Modern Living Room",
    description: "A sleek and contemporary living room design",
    imageUrl: "/placeholder.svg?height=400&width=600",
    featuredProducts: ["Sofa", "Coffee Table", "Floor Lamp"],
    style: "Contemporary",
    customCategories: ["Minimalist", "Urban"],
    colorPalette: ["#F5E6D3", "#A8C69F", "#3D405B", "#81B29A"],
    usage: "Perfect for open-concept apartments and modern homes",
    viewCount: 1234,
    createdAt: "2024-06-24"
  }

export default function TemplateDetailsPage() {
  return (
    <TemplateDetailsBody {...templateData}/>
  )
}
