"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, MoreVertical, Eye, Trash2 } from "lucide-react"

interface DesignEditProps {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    editTime: string;
    editor: {
      name: string;
      avatarUrl: string;
    };
    onViewDetails: () => void;
    onRemove: () => void;
  }
  
export default function RecentStyleEditCard({
    id,
    imageUrl,
    title,
    description,
    editTime,
    editor,
    onViewDetails,
    onRemove,
}: DesignEditProps) {
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  
    return (
      <Card className="w-full max-w-md overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Recently Edited
          </Badge>
        </div>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white text-black">
              <DropdownMenuItem className="hover:bg-slate-300" onClick={onViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-300" onClick={() => setIsRemoveDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={editor.avatarUrl} alt={editor.name} />
              <AvatarFallback>{editor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{editor.name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {editTime}
          </div>
        </CardFooter>
  
        <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle>Are you sure you want to remove this design?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the design
                and remove it from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="bg-red-500 text-white hover:bg-red-600" onClick={() => {
                onRemove();
                setIsRemoveDialogOpen(false);
              }}>
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }