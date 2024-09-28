import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Eye, BookmarkPlus } from "lucide-react"

interface ImageCardProps {
  src: string
  alt: string
  title: string
}

export default function StyleImagePreview({ src, alt, title }: ImageCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-lg">
    <CardContent className="p-0">
      <div className="relative aspect-video">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 p-4 flex justify-between items-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-white hover:bg-primary-500 hover:border-primary"
            >
              <Eye className="h-4 w-4 mr-2" />
              View details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white hover:bg-primary-500 hover:border-primary"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save element
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}