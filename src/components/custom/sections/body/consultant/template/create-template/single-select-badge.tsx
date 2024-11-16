'use client'

import { Style } from "@/types/frontend/entities"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ToggleableBadgeProps {
    style: Style
    isActive: boolean
    onSelect: (id: string) => void
  }
  
export const SingleSelectBadge: React.FC<ToggleableBadgeProps> = ({ style, isActive, onSelect }) => {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "mr-2 mb-2 transition-all duration-200 ease-in-out",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-background text-foreground hover:bg-secondary/80"
        )}
        onClick={() => onSelect(style.id)}
      >
        {style.name}
      </Button>
    )
  }