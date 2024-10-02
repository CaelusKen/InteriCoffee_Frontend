'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Room } from '@/types/room-editor'

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (room: Room) => void;
}

export default function RoomDialog({ open, onOpenChange, onSave }: RoomDialogProps) {
  const [width, setWidth] = useState(5)
  const [length, setLength] = useState(5)
  const [height, setHeight] = useState(3)

  const handleSave = () => {
    onSave({ width, length, height })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-white dark:text-black'>
        <DialogHeader>
          <DialogTitle>Room Dimensions</DialogTitle>
          <DialogDescription>Enter the dimensions of your room in meters.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">Width</Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="length" className="text-right">Length</Label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">Height</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className='dark:text-white'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}