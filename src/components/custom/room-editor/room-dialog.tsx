import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Room } from '@/types/room-editor'

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (room: Room) => void;
  initialRoom: Room;
}

const coffeeShopPresets = {
  'Main Seating Area': { width: 8, length: 10, height: 3 },
  'Counter and Order Area': { width: 5, length: 4, height: 3 },
  'Outdoor Patio': { width: 6, length: 8, height: 3 },
  'Private Meeting Room': { width: 4, length: 5, height: 3 },
  'Cozy Corner': { width: 3, length: 4, height: 3 },
  'Barista Workspace': { width: 3, length: 5, height: 3 },
}

export default function RoomDialog({ open, onOpenChange, onSave, initialRoom }: RoomDialogProps) {
  const [width, setWidth] = useState(initialRoom.width)
  const [length, setLength] = useState(initialRoom.length)
  const [height, setHeight] = useState(initialRoom.height)

  useEffect(() => {
    setWidth(initialRoom.width)
    setLength(initialRoom.length)
    setHeight(initialRoom.height)
  }, [initialRoom])

  const handleSave = () => {
    onSave({ width, length, height })
    onOpenChange(false)
  }

  const handlePresetChange = (preset: string) => {
    const { width, length, height } = coffeeShopPresets[preset as keyof typeof coffeeShopPresets]
    setWidth(width)
    setLength(length)
    setHeight(height)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Coffee Shop Room Dimensions</DialogTitle>
          <DialogDescription>Choose a preset or enter custom dimensions for your coffee shop space (in meters).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="preset" className="text-right">Preset</Label>
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Choose a preset" />
              </SelectTrigger>
              <SelectContent className='text-black bg-white'>
                {Object.keys(coffeeShopPresets).map((preset) => (
                  <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}