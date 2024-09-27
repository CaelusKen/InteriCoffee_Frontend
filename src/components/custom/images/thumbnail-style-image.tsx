import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Edit3Icon } from "lucide-react"

export default function ThumbnailStyleImage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative w-full max-w-[1400px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="https://placehold.co/900x300"
        className="w-full h-auto"
        alt="Style of the Day"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
          <Button 
            variant="secondary" 
            className="bg-white text-black hover:bg-gray-200"
          >
            <Edit3Icon className="mr-2 h-4 w-4" />
            View in Editor
          </Button>
        </div>
      )}
    </div>
  )
}