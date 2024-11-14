"use client"

import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Product, Style } from '@/types/frontend/entities'
import { useSession } from 'next-auth/react'
import React, { Suspense, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Canvas, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import LoadingPage from '@/components/custom/loading/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fetchAllProduct = async({ pageNo = 1, pageSize = 10 }): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>('products', { pageNo, pageSize })
}

const fetchAccountByEmail = async(email: string): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchStyles =  async({ pageNo = 1, pageSize = 10 }): Promise<ApiResponse<PaginatedResponse<Style>>> => {
  return api.getPaginated<Style>('styles', { pageNo, pageSize })
}

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

const Documentation = ({ onProceed }: { onProceed: () => void }) => {
  const [hasRead, setHasRead] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="w-full max-w-8xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Template Creation Guidelines</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Please read all instructions carefully before proceeding to create a template.
          </AlertDescription>
        </Alert>
        
        <ScrollArea className="h-[400px] pr-4">
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">1. About Creating the Template</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Choose a clear and descriptive name for your template.</li>
                <li>Ensure your template design is original and does not infringe on any copyrights.</li>
                <li>Use high-quality images that are relevant to the template's theme.</li>
                <li>Select at least 5 product models that complement the template's design.</li>
                <li>Consider the target audience and purpose of the template when designing.</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">2. Design Best Practices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain a consistent color scheme throughout the template.</li>
                <li>Use appropriate spacing and alignment for a clean, professional look.</li>
                <li>Ensure text is legible and contrasts well with the background.</li>
                <li>Optimize the template for various screen sizes and devices.</li>
                <li>Consider accessibility guidelines in your design choices.</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">3. Publishing Guidelines</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Review your template thoroughly before submission.</li>
                <li>Provide accurate and detailed descriptions for your template.</li>
                <li>Tag your template with relevant categories and keywords.</li>
                <li>Be prepared to make revisions based on reviewer feedback.</li>
                <li>Understand that published templates may be subject to user ratings and reviews.</li>
              </ul>
            </div>
          </section>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={hasRead}
            onCheckedChange={(checked) => setHasRead(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm">
            I have read and understood all the instructions provided above.
          </Label>
        </div>
        <Button 
          onClick={onProceed} 
          disabled={!hasRead || timeSpent < 30}
          className="w-full"
        >
          Proceed to Sketch Phase
        </Button>
        {timeSpent < 30 && (
          <p className="text-sm text-muted-foreground text-center">
            Please spend at least {30 - timeSpent} more seconds reviewing the instructions.
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

const SketchPhase = ({ account, products, styles, onSave }: { account: Account, products: Product[], styles: Style[], onSave: (data: any) => void }) => {
  const [templateName, setTemplateName] = useState('')
  const [templateImage, setTemplateImage] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  const filteredProducts = products.filter(product => product.merchantId === account.merchantId)


  const handleSave = () => {
    if (templateName && templateImage && selectedModels.length >= 5) {
      onSave({
        name: templateName,
        image: templateImage,
        models: selectedModels
      })
    } else {
      alert('Please fill in all required fields and select at least 5 models.')
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
          <Label htmlFor="templateImage">Template Image URL</Label>
          <Input type='file' accept='image/*' id="templateImage" value={templateImage} onChange={(e) => setTemplateImage(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="styles">Template Styles</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select your style" />
            </SelectTrigger>
            <SelectContent>
              {styles.map((style, index) => (
                <SelectItem key={index} value={style.name}>{style.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Select at least 5 models</Label>
          <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex flex-col items-center space-y-2 border p-2 rounded-md">
                  <div className="w-full h-40">
                    <Suspense fallback={<LoadingPage />}>
                      <Canvas>
                          <ambientLight intensity={0.4} />
                          <directionalLight position={[5, 5, 5]} />
                          <Model url={product.modelTextureUrl} />
                          <OrbitControls />
                          <Environment preset="studio" />
                      </Canvas>
                    </Suspense>
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

export default function ConsultantCreateTemplate() {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data: session } = useSession()
  const [account, setAccount] = useState<Account | null>(null)
  const { toast } = useToast()
  const [phase, setPhase] = useState<'documentation' | 'sketch'>('documentation')
  const [templateData, setTemplateData] = useState(null)

  const productsQuery = useQuery({
    queryKey: ['products', pageNo, pageSize],
    queryFn: () => fetchAllProduct({ pageNo, pageSize })
  })

  const stylesQuery = useQuery({
    queryKey: ['styles', pageNo, pageSize],
    queryFn: () => fetchStyles({ pageNo, pageSize })
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchAccountByEmail(session.user.email)
        .then((res) => {
          const mappedAccount = mapBackendToFrontend<Account>(res.data, 'account')
          setAccount(mappedAccount)
        }).catch((error) => {
          toast({
            title: 'Error',
            description: `Error in load account: ${error}`,
            variant: 'destructive'
          })
        })
    }
  }, [session, toast])

  const products = productsQuery.data?.data.items ?? []
  const styles = stylesQuery.data?.data.items ?? []

  const handleProceed = () => {
    setPhase('sketch')
  }

  const handleSave = (data: any) => {
    setTemplateData(data)
    console.log('Template data:', data)
    toast({
      title: 'Success',
      description: 'Template saved successfully',
    })
    setPhase('documentation')
  }

  if (!account) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      {phase === 'documentation' ? (
        <Documentation onProceed={handleProceed} />
      ) : (
        <SketchPhase account={account} products={products} styles={styles} onSave={handleSave} />
      )}
    </div>
  )
}