'use client'

import { useState, useRef, useEffect } from 'react'
import Slider from 'react-slick'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, PerspectiveCamera, Center, Environment } from '@react-three/drei'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Bookmark, ShoppingCart, Eye } from 'lucide-react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface ProductImage {
  src: string
  alt: string
}

interface ProductProps {
    id: string
    name: string
    merchant: string
    images: ProductImage[]
    modelUrl: string
    price: number
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
  
    return <Center><primitive object={scene} /></Center>
  }
  
  export default function FurnitureProductCard({ id, name, merchant, images, modelUrl, price }: ProductProps) {
    const [showModel, setShowModel] = useState(false)
    const sliderRef = useRef<Slider>(null)
  
    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    }
  
    useEffect(() => {
      if (showModel && sliderRef.current) {
        sliderRef.current.slickPause()
      } else if (sliderRef.current) {
        sliderRef.current.slickPlay()
      }
    }, [showModel])
  
    const handleSaveToCollection = () => {
      // Implement save to collection functionality
      console.log('Saved to collection:', id)
    }
  
    const handleAddToCart = () => {
      // Implement add to cart functionality
      console.log('Added to cart:', id)
    }
  
    const handleViewDetails = () => {
      // Implement view details functionality
      console.log('Viewing details for:', id)
    }
  
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardContent className="p-0">
          <div
            className="relative aspect-square overflow-hidden"
            onMouseEnter={() => setShowModel(true)}
            onMouseLeave={() => setShowModel(false)}
          >
            <AnimatePresence>
              {!showModel && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </Slider>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showModel && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Canvas>
                    <PerspectiveCamera makeDefault fov={50} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <Model url={modelUrl} />
                    <OrbitControls enableZoom={false} />
                    <Environment
                      preset="apartment"
                      background
                      blur={0.5}
                    />
                  </Canvas>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={handleSaveToCollection}
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Save to Collection</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <div className="flex justify-between items-start w-full">
            <div>
              <h3 className="text-lg font-semibold dark:text-gray-100">{name}</h3>
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-100">By {merchant}</Badge>
            </div>
            <div className="text-lg font-bold dark:text-gray-100">${price}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }