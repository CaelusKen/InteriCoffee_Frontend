import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeartIcon, ShoppingCartIcon, InfoIcon } from "lucide-react"

interface FurnitureCardProps {
  name: string;
  price: number;
  modelSrc?: string;
  categories: string[];
  colSpan?: number;
}

export default function FurnitureCard({ name, price, modelSrc, categories, colSpan = 1 }: FurnitureCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className={`w-full max-w-xs bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300 col-span-${colSpan}`}>
      <div className="relative">
        <div className="aspect-square w-full bg-muted">
          {modelSrc ? (
            <img
              src={modelSrc}
              alt={`${name} 3D Model`}
              className="w-full h-full object-cover rounded-t-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 border-black text-black hover:text-white hover:bg-primary hover:border-primary bg-background/60 backdrop-blur-sm"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-left">{name}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.slice(0, 2).map((category, index) => (
            <Badge key={index} variant="destructive" className="text-xs px-1 py-0 bg-secondary-400 text-neutral-900 dark:text-neutral-200 dark:bg-primary-700">
              {category}
            </Badge>
          ))}
          {categories.length > 2 && (
            <Badge variant="destructive" className="text-xs px-1 py-0 bg-secondary-400 text-neutral-900 dark:text-neutral-200 dark:bg-primary-700">
              +{categories.length - 2}
            </Badge>
          )}
        </div>
        <p className="text-xl font-bold text-primary dark:text-white text-left">€{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="flex-1 h-9 px-2 text-white text-base"
          size="sm"
        >
          <ShoppingCartIcon className="h-4 w-4 mr-2" />
          Add to cart
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="h-9 w-9 p-0"
          aria-label="View Details"
        >
          <InfoIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
