'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { api } from "@/service/api"
import { Product, ProductCategory } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from '@/types/api'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei"
import LoadingPage from '@/components/custom/loading/loading'
import { Model } from './model'
import { MerchantInfo } from './merchant-info'
import { useAccessToken } from '@/hooks/use-access-token'

const fetchProduct = async (id: string, accessToken: string): Promise<ApiResponse<Product>> => {
  return api.getById<Product>(`products`, id, accessToken)
}

const fetchCategory = async(accessToken: string) : Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>('product-categories', undefined, accessToken)
}

interface ProductDetailsProps {
  productId: string
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const accessToken = useAccessToken()

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId, accessToken ?? ''),
    enabled: !!productId,
  })

  const productCategoriesQuery = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => fetchCategory(accessToken ?? '')
  })

  if (productQuery.isLoading) {
    return <LoadingPage />
  }
  
  if (productQuery.isError) {
    return <div>Error loading product data. Please try again.</div>
  }
  
  const product = productQuery.data?.data

  const normalImages = product?.images?.normalImages || []
  
  const productCategories = productCategoriesQuery.data?.data.items ?? []

  const currentProductCategoryNames = product?.categoryIds
    .map(categoryId => productCategories.find(category => category.id === categoryId)?.name)
    .filter(Boolean)

  if (!product) {
    return <div>No product found.</div>
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/manager/products" className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Tabs defaultValue="images" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="model">Model</TabsTrigger>
          </TabsList>
          <TabsContent value="images">
            <div>
              <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                <img
                  src={product.images.thumbnail || "/placeholder.svg"}
                  alt={product.name}
                  className="h-[480px] object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product?.images.normalImages?.length > 0 && product?.images.normalImages?.map((image, index) => (
                  <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="object-cover h-[160px] w-[160px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="model">
            {product.modelTextureUrl ? (
              <Canvas>
                <PerspectiveCamera makeDefault fov={50} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <Model url={product.modelTextureUrl} />
                <OrbitControls enableZoom={false} />
                <Environment preset="apartment" background blur={0.5} />
              </Canvas>
            ) : (
              <p>No model found for this product</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold">Description</Label>
            <p className="mt-1 text-gray-600">{product.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">Category</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {currentProductCategoryNames?.length ? (
                  currentProductCategoryNames.map((productCategory, index) => (
                    <span key={index} className="px-4 py-1 bg-gray-100 text-black w-fit rounded-full text-sm">
                      {productCategory}
                    </span>
                  ))
                ) : (
                  <p>This product has no categories</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold">Status</Label>
              <p className="mt-1">{product.status}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Selling Price</Label>
              <p className="mt-1">{product.sellingPrice.toLocaleString("vi-VN", {style:"currency", currency:"VND"})}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">True Price</Label>
              <p className="mt-1">{product.truePrice.toLocaleString("vi-VN", {style:"currency", currency:"VND"})}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Quantity</Label>
              <p className="mt-1">{product.quantity}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Dimensions</Label>
              <p className="mt-1">{product.dimensions}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-semibold">Materials</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {product.materials.map((material, index) => (
                <span key={index} className="px-4 py-1 bg-gray-100 text-black w-fit rounded-full text-sm">
                  {material}
                </span>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-semibold">Available Sale Campaigns</Label>
            <p className="mt-1">{product.campaignId || "There are no campaigns for this product"}</p>
          </div>

          <MerchantInfo merchantId={product.merchantId} />
        </div>
      </div>
    </section>
  )
}