import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Furniture, TransformUpdate } from '@/types/room-editor'

interface InspectorProps {
  selectedItem: number | null;
  furniture: Furniture[];
  onUpdateTransform: (update: TransformUpdate) => void;
}

export default function Inspector({ selectedItem, furniture, onUpdateTransform }: InspectorProps) {
  const item = furniture.find(i => i.id === selectedItem)

  if (!item) return <div className="p-4">No item selected</div>

  return (
    <ScrollArea className="h-[400px]">
      <div className="p-4">
        <h3 className="font-bold mb-4">{item.name}</h3>
        <div className="space-y-4">
          {['position', 'rotation', 'scale'].map((prop) => (
            <div key={prop}>
              <Label>{prop.charAt(0).toUpperCase() + prop.slice(1)}</Label>
              <div className="grid grid-cols-3 gap-2">
                {['x', 'y', 'z'].map((axis, index) => (
                  <Input
                    key={axis}
                    type="number"
                    value={item[prop as keyof Pick<Furniture, 'position' | 'rotation' | 'scale'>][index]}
                    onChange={(e) => {
                      const newValue = [...item[prop as keyof Pick<Furniture, 'position' | 'rotation' | 'scale'>]]
                      newValue[index] = parseFloat(e.target.value)
                      onUpdateTransform({
                        id: item.id,
                        type: prop as 'position' | 'rotation' | 'scale',
                        value: newValue as [number, number, number]
                      })
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}