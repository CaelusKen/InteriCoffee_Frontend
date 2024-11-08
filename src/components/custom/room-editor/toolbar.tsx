import React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Save,
  Undo,
  Redo,
  FileUp,
  Share2,
  Download,
  Plus,
  Home,
  DoorOpen,
  Sofa,
  Lamp,
  Table,
  Trash2,
  Move,
  Rotate3D,
  Scale,
  ChevronDown,
} from "lucide-react"
import { Furniture } from "@/types/room-editor"
import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ToolbarProps {
  onAddFurniture: (model: string, category: Furniture["category"]) => void
  transformMode: "translate" | "rotate" | "scale"
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void
  onUndo: () => void
  onRedo: () => void
  onLoad: () => void
  onOpenRoomDialog: () => void
  onClearAll: () => void
  onAddFloor: () => void
  onAddRoom: () => void
  onExport: () => void
  onShare: () => void
  onSaveCustomer: () => void
  onSaveMerchant: () => void
}

export default function Toolbar({
  onAddFurniture,
  transformMode,
  setTransformMode,
  onUndo,
  onRedo,
  onLoad,
  onOpenRoomDialog,
  onClearAll,
  onAddFloor,
  onAddRoom,
  onExport,
  onShare,
  onSaveCustomer,
  onSaveMerchant,
}: ToolbarProps) {
  const { data: session } = useSession()

  const furnitureItems = [
    { category: "seating", items: [
      { name: "Chair", model: "/assets/3D/chair.glb" },
      { name: "Sofa", model: "/assets/3D/sofa.glb" },
    ]},
    { category: "tables", items: [
      { name: "Coffee Table", model: "/assets/3D/table.glb" },
    ]},
    { category: "lightings", items: [
      { name: "Ceiling Lamp", model: "/assets/3D/ceiling-lamp-2.glb" },
    ]},
  ]

  return (
    <TooltipProvider>
      <div className="bg-background border-b p-2 flex items-center space-x-2">
        <div className="flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onUndo}>
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onRedo}>
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onLoad}>
                <FileUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load Design</p>
            </TooltipContent>
          </Tooltip>
          {session?.user.role?.match("CUSTOMER") && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Design</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onSaveCustomer}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Design</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Design</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
          {session?.user.role?.match("CONSULTANT") && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onExport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export Design</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onSaveMerchant}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save as Template</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>

        <div className="flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onOpenRoomDialog}>
                <Home className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Room</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onAddFloor}>
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Floor</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onAddRoom}>
                <DoorOpen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Room</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Select
          value={transformMode}
          onValueChange={(value) =>
            setTransformMode(value as "translate" | "rotate" | "scale")
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Transform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="translate">
              <div className="flex items-center">
                <Move className="mr-2 h-4 w-4" />
                <span>Move</span>
              </div>
            </SelectItem>
            <SelectItem value="rotate">
              <div className="flex items-center">
                <Rotate3D className="mr-2 h-4 w-4" />
                <span>Rotate</span>
              </div>
            </SelectItem>
            <SelectItem value="scale">
              <div className="flex items-center">
                <Scale className="mr-2 h-4 w-4" />
                <span>Scale</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[130px]">
              Add Furniture <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {furnitureItems.map((category) => (
              <React.Fragment key={category.category}>
                <DropdownMenuLabel>{category.category}</DropdownMenuLabel>
                {category.items.map((item) => (
                  <DropdownMenuItem
                    key={item.model}
                    onClick={() => onAddFurniture(item.model, category.category as Furniture["category"])}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onClearAll}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear All</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex justify-end w-full">
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Auto-saving...</span>
            <Save className="h-4 w-4 text-muted-foreground animate-pulse" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}