'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react'
import { Product, Style, Template } from '@/types/frontend/entities'
import { ApiResponse } from '@/types/api'
import { api } from '@/service/api'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const fetchStyleById = async(id: string) : Promise<ApiResponse<Style>> => {
  return api.getById<Style>('styles', id)
}

const deleteTemplate = async(id: string) : Promise<ApiResponse<Style>> => {
  return api.delete<Style>(`styles/${id}`)
}

export default function ConsultantTemplateCard(data: Template) {
  const [isPublished, setIsPublished] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [styleName, setStyleName] = useState<string | null>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
   fetchStyleById(data.styleId)
    .then((res) => {
      setStyleName(res.data.name)
    }).catch((err) => {
      toast({
        title: 'Error fetching Style',
        description: `Error fetching style at: ${err}`
      })
    })
  }, [data.styleId, toast])

  const handleUpdateTemplate = () => {
    setIsLoading(true)
    router.push(`/consultant/templates/${data.id}/update`)
  }

  const handleViewTemplateDetails = () => {
    setIsLoading(true)
    router.push(`/consultant/templates/${data.id}`)
  }

  const handleDeleteTemplate = () => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteTemplate = async () => {
    setShowDeleteDialog(false)
    setIsLoading(true)
    try {
      const res = await deleteTemplate(data.id)
      if (res.status === 200) {
        toast({
          title: 'Delete Template Successfully',
          description: 'Template Deleted Successfully',
          className: 'bg-green-500'
        })
        router.refresh()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: 'Delete Template Failed',
        description: 'Template deletion failed. Please check network log and console for details.',
        className: 'bg-red-500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-[400px]">Loading...</div>
  }

  return (
    <>
      <Card className="w-full max-w-7xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/25">
        <div className="flex flex-col md:flex-row md:h-[400px]">
          <div className="relative md:w-1/3">
            <img src={data.imageUrl} alt={data.name} className="w-full h-48 md:h-full object-cover" />
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-2 right-2 md:bottom-4 md:right-4"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronLeft className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
          <div className="md:w-2/3 flex flex-col">
            <CardContent className="p-4 bg-background dark:bg-background flex-grow overflow-y-auto">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-primary">{data.name}</h2>
                <div className="flex gap-2">
                  <Badge variant="secondary">{styleName}</Badge>
                  <Badge className={`${data.type.match("Sketch") ? 'bg-yellow-500': 'bg-green-500'}`}>
                    {data.type.match("Sketch") ? "Sketch" : "Template"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{data.description}</p>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-black dark:text-white">Categories:</h3>
                <div className="flex flex-wrap gap-2">
                  {data.categories.map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                {!data.type.match("Sketch") && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-black dark:text-white">Usage:</h3>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                  </div>
                )}
                
                {data.type.match("Sketch") && (
                  <div className="mb-4 p-4 bg-warning/20 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <h3 className="font-semibold text-warning">Sketch Incomplete</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please add the following to complete your sketch:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                      <li>{data.floors && '3D View'}</li>
                      <li>Color Palette</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted dark:bg-muted/50 flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">0 views</span>
              </div>
              <div className='flex gap-4 items-center'>
                <Button 
                  className='bg-blue-500 hover:bg-blue-600 dark:text-white'
                  onClick={handleViewTemplateDetails}
                >
                  View Full Template
                </Button>
                <Button 
                  className='bg-yellow-500 hover:bg-yellow-600 dark:text-white'
                  onClick={handleUpdateTemplate}
                >
                  Edit Template
                </Button>
                <Button 
                  className='bg-red-500 hover:bg-red-600 dark:text-white'
                  onClick={handleDeleteTemplate}
                >
                  Remove Template
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsPublished(true)} 
                  disabled={data.type === "Template"}
                >
                  {data.type === "Sketch" ? "Publish Template" : "Template Published"}
                </Button>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this template?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTemplate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}