import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight, Box as BoxIcon, Eye, EyeOff } from 'lucide-react'
import { Furniture } from '@/types/room-editor'

interface HierarchyProps {
  furniture: Furniture[];
  selectedItem: number | null;
  onSelectItem: (id: number) => void;
  onToggleVisibility: (id: number) => void;
}

export default function Hierarchy({ furniture, selectedItem, onSelectItem, onToggleVisibility }: HierarchyProps) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="p-2">
        <div className="font-bold mb-2">Hierarchy</div>
        {furniture.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-1 cursor-pointer ${selectedItem === item.id ? 'bg-accent' : ''}`}
            onClick={() => onSelectItem(item.id)}
          >
            <ChevronRight className="w-4 h-4 mr-1" />
            <BoxIcon className="w-4 h-4 mr-2" />
            <span>{item.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={(e) => {
                e.stopPropagation()
                onToggleVisibility(item.id)
              }}
            >
              {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}