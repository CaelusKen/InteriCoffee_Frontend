'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ChevronDown, ChevronUp, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react'

interface TemplateCardProps {
  name: string
  description: string
  imageUrl: string
  featuredProducts: string[]
  style: string
  customCategories: string[]
  colorPalette: string[]
  usage: string
  viewCount: number
  isSketch: boolean
}

export default function ConsultantTemplateCard({
  name,
  description,
  imageUrl,
  featuredProducts,
  style,
  customCategories,
  colorPalette,
  usage,
  viewCount,
  isSketch
}: TemplateCardProps = {
  name: "Modern Living Room",
  description: "A sleek and contemporary living room design",
  imageUrl: "/placeholder.svg?height=200&width=300",
  featuredProducts: ["Sofa", "Coffee Table", "Floor Lamp"],
  style: "Contemporary",
  customCategories: ["Minimalist", "Urban"],
  colorPalette: ["#F5E6D3", "#A8C69F", "#3D405B", "#81B29A"],
  usage: "Perfect for open-concept apartments and modern homes",
  viewCount: 1234,
  isSketch: false
}) {
  const [isPublished, setIsPublished] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="w-full max-w-7xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/25">
      <div className="flex flex-col md:flex-row md:h-[400px]">
        <div className="relative md:w-1/3">
          <img src={imageUrl} alt={name} className="w-full h-48 md:h-full object-cover" />
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute bottom-2 right-2 md:bottom-4 md:right-4"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronLeft className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            {isExpanded ? "Less" : "More"}
          </Button>
        </div>
        <div className="md:w-2/3 flex flex-col">
          <CardContent className="p-4 bg-background dark:bg-background flex-grow overflow-y-auto">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-primary">{name}</h2>
              <div className="flex gap-2">
                <Badge variant="secondary">{style}</Badge>
                <Badge className={`${isSketch ? 'bg-yellow-500': 'bg-green-500'}`}>
                  {isSketch ? "Sketch" : "Template"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-black dark:text-white">Featured Products:</h3>
              <div className="flex flex-wrap gap-2">
                {featuredProducts.map((product, index) => (
                  <Badge key={index} variant="outline">{product}</Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-black dark:text-white">Categories:</h3>
              <div className="flex flex-wrap gap-2">
                {customCategories.map((category, index) => (
                  <Badge key={index} variant="outline">{category}</Badge>
                ))}
              </div>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
              {!isSketch && (
                <>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-black dark:text-white">Color Palette:</h3>
                    <div className="flex gap-2">
                      {colorPalette.map((color, index) => (
                        <div key={index} className="w-6 h-6 rounded-full border border-border" style={{backgroundColor: color}}></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-black dark:text-white">Usage:</h3>
                    <p className="text-sm text-muted-foreground">{usage}</p>
                  </div>
                </>
              )}
              
              {isSketch && (
                <div className="mb-4 p-4 bg-warning/20 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <h3 className="font-semibold text-warning">Sketch Incomplete</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please add the following to complete your sketch:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    <li>Color Palette</li>
                    <li>3D View</li>
                    <li>Usage Description</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted dark:bg-muted/50 flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{viewCount} views</span>
            </div>
            <div className='flex gap-4 items-center'>
              <Button 
                className='bg-yellow-500 hover:bg-yellow-600 dark:text-white'>
                Edit Template
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsPublished(true)} 
                disabled={isSketch || isPublished}
              >
                {isPublished ? "Published" : "Publish"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}