import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X } from 'lucide-react'

interface MenuItem {
  name: string
  price: number
}

interface MenuBoardDesignerProps {
  menuItems: MenuItem[]
  onUpdateMenuBoard: (items: MenuItem[]) => void
}

export default function MenuBoardDesigner({ menuItems, onUpdateMenuBoard }: MenuBoardDesignerProps) {
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  const handleAddItem = () => {
    if (newItemName && newItemPrice) {
      onUpdateMenuBoard([...menuItems, { name: newItemName, price: parseFloat(newItemPrice) }])
      setNewItemName('')
      setNewItemPrice('')
    }
  }

  const handleRemoveItem = (index: number) => {
    onUpdateMenuBoard(menuItems.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="flex-grow">
          <Label htmlFor="itemName">Item Name</Label>
          <Input
            id="itemName"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter item name"
          />
        </div>
        <div className="w-24">
          <Label htmlFor="itemPrice">Price</Label>
          <Input
            id="itemPrice"
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAddItem}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
      <ScrollArea className="h-[200px]">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{item.name}</span>
              <div className="flex items-center space-x-2">
                <span>${item.price.toFixed(2)}</span>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}