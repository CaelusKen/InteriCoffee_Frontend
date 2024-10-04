import React from 'react'
import { Button } from "@/components/ui/button"
import { Move, RotateCw, Maximize, Sun, Moon, Undo, Redo, Save, FolderOpen, Home, Trash2 } from 'lucide-react'
import { ThemeToggler } from '../buttons/theme-toggler';

type FurnitureType = 'sofa' | 'chair' | 'table';

interface ToolbarProps {
  onAddFurniture: (type: FurnitureType) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onOpenRoomDialog: () => void;
  onClearAll: () => void;
}

export default function Toolbar({
  onAddFurniture,
  transformMode,
  setTransformMode,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onOpenRoomDialog,
  onClearAll
}: ToolbarProps) {
  return (
    <div className="flex justify-between items-center p-2 dark:bg-gray-800 border-b">
      <div className="space-x-2">
        <Button onClick={() => onAddFurniture('sofa')} className='text-white'>Add Sofa</Button>
        <Button onClick={() => onAddFurniture('chair')} className='text-white'>Add Chair</Button>
        <Button onClick={() => onAddFurniture('table')} className='text-white'>Add Table</Button>
      </div>
      <div className="space-x-2">
        <Button
          variant={transformMode === 'translate' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTransformMode('translate')}
          className='hover:bg-primary-600 hover:text-white'
        >
          <Move className="w-4 h-4" />
        </Button>
        <Button
          variant={transformMode === 'rotate' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTransformMode('rotate')}
          className='hover:bg-primary-600 hover:text-white'
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant={transformMode === 'scale' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setTransformMode('scale')}
          className='hover:bg-primary-600 hover:text-white'
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-x-2">
        <Button onClick={onUndo} size="icon" className='hover:bg-primary-600 hover:text-white'><Undo className="w-4 h-4" /></Button>
        <Button onClick={onRedo} size="icon" className='hover:bg-primary-600 hover:text-white'><Redo className="w-4 h-4" /></Button>
        <Button onClick={onSave} size="icon" className='hover:bg-primary-600 hover:text-white'><Save className="w-4 h-4" /></Button>
        <Button onClick={onLoad} size="icon" className='hover:bg-primary-600 hover:text-white'><FolderOpen className="w-4 h-4" /></Button>
        <Button onClick={onOpenRoomDialog} size="icon" className='hover:bg-primary-600 hover:text-white'><Home className="w-4 h-4" /></Button>
        <Button onClick={onClearAll} size="icon" className='hover:bg-primary-600 hover:text-white'><Trash2 className="w-4 h-4" /></Button>
        <ThemeToggler />
      </div>
    </div>
  )
}