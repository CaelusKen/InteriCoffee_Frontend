"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Center,
  Environment,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import * as THREE from "three";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Product, ProductCategory } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useCart } from "@/components/custom/cart/cart-context";
import { useQuery } from "@tanstack/react-query";
import { MerchantInfo } from "../merchant/products/merchant-info";
import LoadingPage from "@/components/custom/loading/loading";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface ProductDetailsProps {
  productId: string;
}

const fetchProductById = async (id: string): Promise<ApiResponse<Product>> => {
  return api.getById(`products`, id);
};

const fetchCategory = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>("product-categories", {
    page,
    pageSize,
  });
};

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

interface ProductProps {
  id: string;
}

const FurnitureDetailsSection: React.FC<ProductProps> = ({ id }) => {
  const [showModel, setShowModel] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { addItem } = useCart();

  const { toast } = useToast();

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const productCategoriesQuery = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => fetchCategory(1),
  });

  const product = productQuery.data?.data;

  const productCategories = productCategoriesQuery.data?.data.items ?? [];

  const currentProductCategoryNames = product?.categoryIds
    .map(
      (categoryId) =>
        productCategories.find((category) => category.id === categoryId)?.name
    )
    .filter(Boolean);

  const handleAddToCart = () => {
    try {
      addItem({
        id: product?.id || "",
        name: product?.name || "",
        price: product?.truePrice || 1000000,
        quantity: 1,
      });
      toast({
        title: "Add to cart successfully",
        description: `Item ${product?.name} has been added to your cart`,
        type: "foreground",
        className: "bg-green-500",
      });
    } catch (error) {
      toast({
        title: "Add to cart fail",
        description: `Item ${product?.name} cannot be added due to ${error}`,
        type: "foreground",
        className: "bg-red-500",
      });
    }
  };

  const handleAddToWishlist = () => {
    console.log("Added to wishlist:", id);
  };
  return (
    <div className="container mx-auto px-10 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-fit">
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
                    <Carousel>
                      <CarouselContent>
                        {product?.images.normalImages.map((image, index) => (
                          <CarouselItem key={index}>
                            <Image
                              src={image}
                              alt={`${product?.name} - Image ${index + 1}`}
                              width={600}
                              height={800}
                              className="w-full h-fit object-cover rounded-lg"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
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
                    className="absolute inset-0 h-full"
                  >
                    {product?.modelTextureUrl ? (
                      <Suspense fallback={<LoadingPage />}>
                        <Canvas>
                          <PerspectiveCamera makeDefault fov={50} />
                          <ambientLight intensity={0.5} />
                          <spotLight
                            position={[10, 10, 10]}
                            angle={0.15}
                            penumbra={1}
                          />
                          <Model url={product.modelTextureUrl} />
                          <OrbitControls enableZoom={false} />
                          <Environment
                            preset="apartment"
                            background
                            blur={0.5}
                          />
                        </Canvas>
                      </Suspense>
                    ) : (
                      <p>No model found for this product</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
          {/* <CardFooter className="p-4">
            <div className="flex space-x-2 overflow-auto pb-2">
              {product?.images.normalImages.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square w-20 overflow-hidden rounded-md ${
                    index === activeImage ? "ring-2 ring-primary" : ""
                  }`}
                  title="Image"
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardFooter> */}
        </Card>
        <Card className="col-span-1 h-full">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold dark:text-white">
                {product?.name}
              </h1>
              <div className="pl-1"><MerchantInfo merchantId={product?.merchantId || ""} /></div>
            </div>
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (4.5/5)
              </span>
            </div>
            <p className="text-2xl font-bold dark:text-white">
              {product?.truePrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <Separator />
            <div>
              <Label className="text-sm font-semibold">
                { (currentProductCategoryNames !== undefined && currentProductCategoryNames.length > 1) ? "Categories": "Category"}
              </Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {currentProductCategoryNames?.length ? (
                  currentProductCategoryNames.map((productCategory, index) => (
                    <span
                      key={index}
                      className="px-4 py-1 bg-gray-100 text-black w-fit rounded-full text-sm"
                    >
                      {productCategory}
                    </span>
                  ))
                ) : (
                  <p>This product has no categories</p>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              {product?.description}
            </p>
            <Separator />
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Product Details
            </h2>
            <div>
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <ul className=" space-y-1 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="flex flex-wrap gap-2 w-full">
                      <p>Material: </p>
                      {product?.materials.map((material, index) => (
                        <Badge key={index}>{material}</Badge>
                      ))}
                    </span>
                  </li>
                  <li>
                    <span className="flex gap-2">
                      <p>Dimensions:</p>{" "}
                      <p className="w-full">{product?.dimensions}</p>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddToWishlist}
              >
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="my-8">
        <h1 className="text-3xl font-semibold">Similar Furniture Items</h1>
        <h3 className="text-[18px]">Look for similar items here</h3>
      </div>
    </div>
  );
};

export default FurnitureDetailsSection;
