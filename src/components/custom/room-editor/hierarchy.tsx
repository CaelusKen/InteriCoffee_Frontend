import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Box as BoxIcon, Eye, EyeOff, Trash2, Edit2 } from 'lucide-react'
import { Furniture } from '@/types/room-editor'

interface HierarchyProps {
  furniture: Furniture[];
  selectedItem: number | null;
  onSelectItem: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onDeleteItem: (id: number) => void;
  onRename: (id: number, newName: string) => void;
}

export default function Hierarchy({
  furniture,
  selectedItem,
  onSelectItem,
  onToggleVisibility,
  onDeleteItem,
  onRename,
}: HierarchyProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleStartEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleFinishEdit = () => {
    if (editingId !== null) {
      onRename(editingId, editingName);
      setEditingId(null);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)] w-full">
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
                onDeleteItem(item.id)
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}