'use client'

import { Badge } from "@/components/ui/badge"
import { Style } from "@/types/frontend/entities"

interface ToggleableBadgeProps {
    style: Style
    isSelected: boolean
    onToggle: (id: string) => void
  }
  
export const ToggleableBadge: React.FC<ToggleableBadgeProps> = ({ style, isSelected, onToggle }) => {
    return (
      <Badge
        variant={isSelected ? "default" : "outline"}
        className={`mr-2 mb-2 w-fit cursor-pointer ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-secondary'}`}
        onClick={() => onToggle(style.id)}
      >
        {style.name}
      </Badge>
    )
  }