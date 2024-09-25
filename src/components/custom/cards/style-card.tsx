'use client'

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from 'framer-motion'

interface StyleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string
  name: string
  creator: string
  onViewDetails: () => void
}

const StyleCard = React.forwardRef<HTMLDivElement, StyleCardProps>(
  ({ className, imageSrc, name, creator, onViewDetails, ...props }, ref) => {

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card
          ref={ref}
          className={cn("w-full overflow-hidden bg-transparent shadow-none border-none rounded-[4px]", className)}
          {...props}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-[4/3]"
          >
            <img  
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover rounded-[1px]"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100 rounded-sm">
              <Button
                variant="secondary"
                onClick={onViewDetails}
                className="text-white bg-transparent hover:bg-white hover:text-black border border-white transition-colors duration-300"
              >
                View Details
              </Button>
            </div>
          </motion.div>
          <CardContent className="p-4 px-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="text-base sm:text-lg font-semibold truncate mb-1 sm:mb-0">{name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">by {creator}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }
)
StyleCard.displayName = "StyleCard"

export default StyleCard;