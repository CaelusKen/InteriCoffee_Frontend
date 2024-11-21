import React, { useState } from 'react'
import { ChevronRight, BoxIcon, Eye, EyeOff, Trash2, Edit2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Furniture } from '@/types/room-editor'

interface HierarchyProps {
  furniture: Furniture[];
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export default function Hierarchy({
  furniture,
  selectedItem,
  onSelectItem,
  onToggleVisibility,
  onDeleteItem,
  onDuplicateItem,
  onRename,
}: HierarchyProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const handleFinishEdit = () => {
    if (editingId !== null) {
      onRename(editingId, editingName)
      setEditingId(null)
      setEditingName('')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Hierarchy</h2>
      <div className="space-y-1">
        {furniture.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-1 cursor-pointer ${selectedItem === item.id ? 'bg-accent' : ''}`}
            onClick={() => onSelectItem(item.id)}
          >
            <ChevronRight className="w-4 h-4 mr-1" />
            <BoxIcon className="w-4 h-4 mr-2" />
            {editingId === item.id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleFinishEdit}
                onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit()}
                className="h-6 py-0 px-1"
              />
            ) : (
              <span>{item.name}</span>
            )}
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
            <Button
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={(e) => {
                e.stopPropagation()
                handleStartEdit(item.id, item.name)
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicateItem(item.id)
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteItem(item.id)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}