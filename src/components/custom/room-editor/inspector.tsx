import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Furniture, TransformUpdate } from '@/types/room-editor'
import { Trash2, Edit2 } from 'lucide-react'

interface InspectorProps {
  selectedItem: number | null;
  furniture: Furniture[];
  onUpdateTransform: (update: TransformUpdate) => void;
  onDeleteItem: (id: number) => void;
  onRename: (id: number, newName: string) => void;
}

export default function Inspector({ selectedItem, furniture, onUpdateTransform, onDeleteItem, onRename }: InspectorProps) {
  const item = furniture.find(i => i.id === selectedItem)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')

  if (!item) return <div className="p-4">No item selected</div>

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditName(item.name)
  }

  const handleFinishEdit = () => {
    onRename(item.id, editName)
    setIsEditing(false)
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit()}
              className="mr-2"
            />
          ) : (
            <h3 className="font-bold">{item.name}</h3>
          )}
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={isEditing ? handleFinishEdit : handleStartEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
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