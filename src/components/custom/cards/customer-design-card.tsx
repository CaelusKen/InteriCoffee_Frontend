'use client'

import { APIDesign } from '@/types/frontend/entities'
import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Clock, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface CustomerDesignCardProps {
    design: APIDesign
}

const CustomerDesignCard = ({ design }: CustomerDesignCardProps) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/25">
      <div className="relative aspect-video">
        <img
          src={ design.image ? design.image : 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={design.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
        >
          {design.type}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{design.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {design.description}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {new Date(design.updateDate).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-end items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/customer/designs/${design.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href={`/designs/${design.id}/edit`}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => console.log('Delete design', design.id)}>
            <Trash2 className="w-4 h-4" />
            Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CustomerDesignCard