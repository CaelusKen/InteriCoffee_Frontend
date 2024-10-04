'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, PerspectiveCamera, Center, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import * as THREE from 'three'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface ProductProps {
  id: string;
  name: string;
  merchant: string;
  images: ProductImage[];
  modelUrl: string;
  price: number;
}

interface ProductImage {
  src: string;
  alt: string;
}

const FurnitureDetailsSection:React.FC<ProductProps> = ({
  id,
  images,
  merchant,
  modelUrl,
  name,
  price
}) => {
  const [showModel, setShowModel] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const handleAddToCart = () => {
    console.log("Added to cart:", id)
  }

  const handleAddToWishlist = () => {
    console.log("Added to wishlist:", id)
  }
  return (
    <div className="container mx-auto px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
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
                    <img
                      src={images[activeImage].src}
                      alt={images[activeImage].alt}
                      className="w-full object-cover transition-all duration-300 ease-in-out"
                    />
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
                      <Environment preset="apartment" background blur={0.5} />
                    </Canvas>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <div className="flex space-x-2 overflow-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square w-20 overflow-hidden rounded-md ${
                    index === activeImage ? 'ring-2 ring-primary' : ''
                  }`}
                  title='Image'
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className='w-full object-cover'
                  />
                </button>
              ))}
            </div>
          </CardFooter>
        </Card>
        <Card className="col-span-1">
          <CardContent className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold dark:text-white">{name}</h1>
              <Badge variant="secondary" className="mt-2">
                By {merchant}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
              <span className="text-sm text-gray-500 dark:text-gray-400">(4.5/5)</span>
            </div>
            <p className="text-2xl font-bold dark:text-white">${price.toFixed(2)}</p>
            <p className="text-gray-600 dark:text-gray-300">
              Elevate your café or home with our stylish Coffee Shop Table. Perfect for intimate conversations or solo work sessions, this table combines form and function in a sleek, modern design.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" onClick={handleAddToWishlist}>
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-12">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Material: Solid oak wood</li>
                <li>Dimensions: 30" x 30" x 29" (H)</li>
                <li>Weight: 45 lbs</li>
                <li>Finish: Natural wood grain</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Sturdy construction</li>
                <li>Water-resistant coating</li>
                <li>Easy assembly</li>
                <li>Scratch-resistant surface</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FurnitureDetailsSection
