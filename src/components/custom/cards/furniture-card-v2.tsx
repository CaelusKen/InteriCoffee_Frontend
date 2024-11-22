"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Slider from "react-slick";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Center,
  Environment,
} from "@react-three/drei";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Bookmark, ShoppingCart, Eye } from 'lucide-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useCart } from "../cart/cart-context";
import { MerchantInfo } from "../sections/body/merchant/products/merchant-info";
import LoadingPage from "../loading/loading";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface ProductProps {
  id: string;
  name: string;
  merchant: string;
  images: string[];
  modelUrl: string;
  price: number;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { camera, size } = useThree();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const boxSize = box.getSize(new THREE.Vector3());
    const boxCenter = box.getCenter(new THREE.Vector3());

    const maxSize = Math.max(boxSize.x, boxSize.y, boxSize.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * 50) / 360));
    const fitWidthDistance = fitHeightDistance / (size.width / size.height);
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      camera.position.set(boxCenter.x, boxCenter.y, boxCenter.z + distance);
      camera.lookAt(boxCenter);
    }
  }, [scene, camera, size]);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function FurnitureProductCard({
  id,
  name,
  merchant,
  images,
  modelUrl,
  price,
}: ProductProps) {
  const [showModel, setShowModel] = useState(false);
  const sliderRef = useRef<Slider>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    if (showModel && sliderRef.current) {
      sliderRef.current.slickPause();
    } else if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  }, [showModel]);

  const handleSaveToCollection = () => {
    console.log("Saved to collection:", id);
  };

  const handleAddToCart = () => {
    try {
      addItem({
        id: id,
        name: name,
        price: price,
        quantity: 1,
      });
      toast({
        title: "Add to cart successfully",
        description: `Item ${name} has been added to your cart`,
        type: "foreground",
        className: "bg-green-500",
      });
    } catch (error) {
      toast({
        title: "Add to cart fail",
        description: `Item ${name} cannot be added due to ${error}`,
        type: "foreground",
        className: "bg-red-500",
      });
    }
  };

  const handleViewDetails = () => {
    router.push(`/furnitures/${id}`);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-0">
        <div
          className="relative aspect-square overflow-hidden"
          onMouseEnter={() => setShowModel(true)}
          onMouseLeave={() => setShowModel(false)}
        >
          <AnimatePresence>
            {!showModel && images && images.length > 0 && (
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
                        src={image}
                        alt={`Product Image ${index + 1}`}
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
                <Suspense fallback={<LoadingPage />}>
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <Center>
                      <Model url={modelUrl} />
                    </Center>
                    <OrbitControls 
                      enableZoom={false}
                      enablePan={false}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 1.5}
                    />
                    <Environment preset="apartment" background blur={0.5} />
                  </Canvas>
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
          {session?.user?.role === "CUSTOMER" && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={handleSaveToCollection}
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Save to Collection</span>
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-4">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-1">
            <h3 className="text-[16px] font-semibold leading-none">{name}</h3>
            <MerchantInfo merchantId={merchant} />
          </div>
          <div className="text-lg font-bold">
            {price.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button className="w-full" onClick={handleViewDetails}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

