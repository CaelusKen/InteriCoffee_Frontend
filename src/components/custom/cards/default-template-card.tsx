import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Eye } from 'lucide-react'

interface TemplateCardProps {
  imageUrl: string
  style: string
  creatorName: string
  creatorAvatar: string
  title: string
  onSave: () => void
  onViewDetails: () => void
}

export default function TemplateCard({
  imageUrl,
  style,
  creatorName,
  creatorAvatar,
  title,
  onSave,
  onViewDetails
}: TemplateCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/25">
      <div className="relative aspect-square">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
        >
          {style}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center gap-2">
          <img
            src={creatorAvatar}
            alt={creatorName}
            className="w-[24px] h-[24px] object-cover rounded-full"
          />
          <span className="text-sm text-muted-foreground">{creatorName}</span>
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