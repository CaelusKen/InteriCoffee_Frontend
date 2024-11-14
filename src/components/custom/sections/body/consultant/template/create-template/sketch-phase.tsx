"use client"
import { Account, Product, Style } from '@/types/frontend/entities'
import React, { Suspense, useEffect, useState } from 'react'
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
import { ToggleableBadge } from './toggleable-badge'

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

export const SketchPhase = ({ account, products, styles, onSave }: { account: Account, products: Product[], styles: Style[], onSave: (data: any) => void }) => {
    const [templateName, setTemplateName] = useState('')
    const [templateDescription, setTemplateDescription] = useState('')
    const [templateImage, setTemplateImage] = useState('')
    const [selectedModels, setSelectedModels] = useState<string[]>([])
    const [selectedStyles, setSelectedStyles] = React.useState<string[]>([])
  
    const filteredProducts = products.filter(product => product.merchantId === account.merchantId)
  
    const { toast } = useToast();
  
    const handleStyleToggle = (styleId: string) => {
      setSelectedStyles(prev => 
        prev.includes(styleId) 
          ? prev.filter(id => id !== styleId) 
          : [...prev, styleId]
      )
    }
  
    const handleSave = () => {
      if (templateName && templateImage && selectedModels.length >= 5) {
        onSave({
          name: templateName,
          description: templateDescription,
          image: templateImage,
          models: selectedModels,
          styles: selectedStyles
        })
      } else {
        toast({
          title: "Error creating template",
          description: "Please fill in all required fields and select at least 5 models.",
          className: "bg-red-500"
        })
      }
    }
  
    return (
      <Card className="w-full max-w-8xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sketch Phase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="templateName">Template Name</Label>
            <Input id="templateName" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="templateDescription">Template Description</Label>
            <Textarea id='templateDescription' value={templateDescription} onChange={(e) => setTemplateDescription(e.target.value)}/>
          </div>
          <div>
            <Label htmlFor="templateImage">Template Image URL</Label>
            <Input type='file' accept='image/*' id="templateImage" value={templateImage} onChange={(e) => setTemplateImage(e.target.value)} />
          </div>
          <div className='flex flex-col gap-4'>
            <Label htmlFor="styles">Template Styles (Select all that apply)</Label>
            {styles.map((style) => (
                <ToggleableBadge
                  key={style.id}
                  style={style}
                  isSelected={selectedStyles.includes(style.id)}
                  onToggle={handleStyleToggle}
                />
              ))}
          </div>
          <div>
            <Label className="mb-2 block">Select at least 5 models</Label>
            <ScrollArea className="h-[400px] border rounded-md p-4">
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex flex-col items-center space-y-2 border p-2 rounded-md">
                    <div className="w-full h-40">
                        <Canvas>
                          <Suspense>
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
                          if (checked) {
                            setSelectedModels([...selectedModels, product.id])
                          } else {
                            setSelectedModels(selectedModels.filter(id => id !== product.id))
                          }
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