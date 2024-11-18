'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { Account, Product, ProductCategory, Style } from '@/types/frontend/entities'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Canvas, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '../../../merchant/products/file-upload'
import { SingleSelectBadge } from './single-select-badge'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { camera, size } = useThree()

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const boxSize = box.getSize(new THREE.Vector3())
    const boxCenter = box.getCenter(new THREE.Vector3())

    const maxSize = Math.max(boxSize.x, boxSize.y, boxSize.z)
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * 50) / 360))
    const fitWidthDistance = fitHeightDistance / (size.width / size.height)
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = distance / 100
      camera.far = distance * 100
      camera.updateProjectionMatrix()

      camera.position.set(boxCenter.x, boxCenter.y, boxCenter.z + distance)
      camera.lookAt(boxCenter)
    }
  }, [scene, camera, size])

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

const fetchProductById = async(id: string): Promise<ApiResponse<Product>> => {
  return api.getById<Product>('products', id)
}

const fetchCategorybyId = async(id: string): Promise<ApiResponse<ProductCategory>> => {
  return api.getById<ProductCategory>('product-categories', id)
}

interface SketchPhaseProps {
  account: Account
  products: Product[]
  styles: Style[]
  onSave: (data: any) => void
}

export const SketchPhase: React.FC<SketchPhaseProps> = ({ account, products, styles, onSave }) => {
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [templateImage, setTemplateImage] = useState<string | null>(null)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)

  const { toast } = useToast()

  const filteredProducts = products.filter(product => product.merchantId === account.merchantId)

  const handleStyleSelect = (style: Style | null) => {
    setSelectedStyleId(style ? style.id : null)
  }

  //Get any selected products, in each selectModels contains the id of the product
  const templateProducts = selectedModels.map(modelId => {
    const product = products.find(product => product.id === modelId)
    if (product) {
      return {
       id: product.id,
       quantity: 1
      }
    }
    return null
  }).filter(product => product) as Product[]

  const handleSave = async () => {
    if (templateName && templateImage && selectedModels.length >= 5 && selectedStyleId) {
      const categoriesSet = new Set<string>()

      

      try {
        for (const model of selectedModels) {
          const res = await fetchProductById(model)
          if (res.status === 200 && res.data) {
            for (const categoryId of res.data.categoryIds) {
              const categoryRes = await fetchCategorybyId(categoryId)
              if (categoryRes.status === 200 && categoryRes.data) {
                categoriesSet.add(categoryRes.data.name)
              }
            }
          }
        }

        const uniqueCategories = Array.from(categoriesSet)

        onSave({
          name: templateName,
          description: templateDescription,
          imageUrl: templateImage,
          categories: uniqueCategories,
          styleId: selectedStyleId,
          products: templateProducts,
        })
      } catch (err) {
        toast({
          title: "Error gathering data",
          description: `Categories cannot be gathered: ${err}`,
          variant: "destructive"
        })
      }
    } else {
      toast({
        title: "Error creating template",
        description: "Please fill in all required fields, select at least 5 models, and choose a style.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="w-full max-w-8xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sketch Phase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="templateName">Template Name</Label>
          <Input 
            id="templateName" 
            value={templateName} 
            onChange={(e) => setTemplateName(e.target.value)} 
            placeholder="Enter template name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="templateDescription">Template Description</Label>
          <Textarea 
            id="templateDescription" 
            value={templateDescription} 
            onChange={(e) => setTemplateDescription(e.target.value)}
            placeholder="Describe your template"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label>Template Image</Label>
          <FileUpload 
            accept="image/*"
            label="Upload template image"
            onChange={(file: File, downloadURL: string) => setTemplateImage(downloadURL)}
          />
        </div>
        <div className="space-y-2">
          <Label>Template Style</Label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <SingleSelectBadge
                key={style.id}
                style={style}
                isActive={selectedStyleId === style.id}
                onSelect={() => handleStyleSelect(style)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="block mb-2">Select at least 5 models</Label>
          <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex flex-col items-center space-y-2 border p-2 rounded-md">
                  <div className="w-full h-40">
                    <Canvas>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[5, 5, 5]} />
                        <Model url={product.modelTextureUrl} />
                        <OrbitControls />
                        <Environment preset="studio" />
                      </Suspense>
                    </Canvas>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`model-${product.id}`} 
                      checked={selectedModels.includes(product.id)} 
                      onCheckedChange={(checked) => {
                        setSelectedModels(checked 
                          ? [...selectedModels, product.id] 
                          : selectedModels.filter(id => id !== product.id)
                        )
                      }}
                    />
                    <Label htmlFor={`model-${product.id}`}>{product.name}</Label>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Button onClick={handleSave} className="w-full">Save Template</Button>
      </CardContent>
    </Card>
  )
}