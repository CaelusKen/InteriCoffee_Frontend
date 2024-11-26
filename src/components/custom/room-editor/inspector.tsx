import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Furniture, TransformUpdate } from '@/types/room-editor'
import { Trash2, Edit2 } from 'lucide-react'

interface InspectorProps {
  selectedItem: string | null;
  furniture: Furniture[];
  onUpdateTransform: (update: TransformUpdate) => void;
  onDeleteItem: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export default function Inspector({ selectedItem, furniture, onUpdateTransform, onDeleteItem, onRename }: InspectorProps) {
  const item = furniture.find(i => i.id === selectedItem)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [localTransform, setLocalTransform] = useState<{
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number]
  }>({ position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] })

  useEffect(() => {
    if (item) {
      setLocalTransform({
        position: item.position,
        rotation: item.rotation,
        scale: item.scale
      })
    }
  }, [item])

  if (!item) return <div className="p-4">No item selected</div>

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditName(item.name)
  }

  const handleFinishEdit = () => {
    onRename(item.id, editName)
    setIsEditing(false)
  }

  const handleTransformChange = (type: 'position' | 'rotation' | 'scale', axis: 0 | 1 | 2, value: number) => {
    const newTransform = { ...localTransform }
    newTransform[type][axis] = value
    setLocalTransform(newTransform)
    onUpdateTransform({ id: item.id, type, value: newTransform[type] })
  }

  const renderTransformControl = (type: 'position' | 'rotation' | 'scale', axis: 0 | 1 | 2, label: string) => {
    const value = localTransform[type][axis]
    const min = type === 'scale' ? 0.1 : -360
    const max = type === 'scale' ? 10 : 360
    const step = type === 'scale' ? 0.1 : 1

    return (
      <div className="flex items-center space-x-2">
        <Label className="w-8">{label}</Label>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([newValue]) => handleTransformChange(type, axis, newValue)}
          className="flex-1"
        />
        <Input
          type="number"
          value={value.toFixed(2)}
          onChange={(e) => handleTransformChange(type, axis, parseFloat(e.target.value))}
          className="w-20"
        />
      </div>
    )
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
          <div>
            <Label>Position</Label>
            {renderTransformControl('position', 0, 'X')}
            {renderTransformControl('position', 1, 'Y')}
            {renderTransformControl('position', 2, 'Z')}
          </div>
          <div>
            <Label>Rotation</Label>
            {renderTransformControl('rotation', 0, 'X')}
            {renderTransformControl('rotation', 1, 'Y')}
            {renderTransformControl('rotation', 2, 'Z')}
          </div>
          <div>
            <Label>Scale</Label>
            {renderTransformControl('scale', 0, 'X')}
            {renderTransformControl('scale', 1, 'Y')}
            {renderTransformControl('scale', 2, 'Z')}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}