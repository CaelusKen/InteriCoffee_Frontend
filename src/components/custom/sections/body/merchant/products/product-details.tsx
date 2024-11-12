"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { api } from "@/service/api"
import { Product, ProductCategory } from "@/types/frontend/entities"
import { ApiResponse } from '@/types/api'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'

const fetchProduct = async (id: string): Promise<ApiResponse<Product>> => {
  return api.getById<Product>(`products`, id)
}

const fetchCategory = async (id: string): Promise<ApiResponse<ProductCategory>> => {
  return api.getById<ProductCategory>('product-categories', id)
}

interface ProductDetailsProps {
  productId: string
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  })

  if (productQuery.isLoading) {
    return <div>Loading product data...</div>
  }

  if (productQuery.isError) {
    return <div>Error loading product data. Please try again.</div>
  }

  const product = productQuery.data?.data

  if (!product) {
    return <div>No product found.</div>
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/merchant/products" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <Link href={`/merchant/products/${productId}/update`} passHref>
          <Button variant="outline" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
            <img
              src={product.images.thumbnail || "/placeholder.svg"}
              alt={product.name}
              className='h-[480px] object-cover'
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images["normalImages"].map((image, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  datatype='data/avil'
                  className='object-cover h-[160px] w-[160px]'
                />
              </div>
            ))}
          </div>
        </div>

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
                {product['categoryIds'] != null ? (product['categoryIds'].map((productCategory, index) => (
                  <span key={index} className="px-4 py-1 bg-gray-100 text-black w-fit rounded-full text-sm">
                    {productCategory}
                  </span>
                ))) : (
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
              <p className="mt-1">{product["sellingPrice"].toLocaleString("vi-VN", {style:"currency", currency:"VND"})}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">True Price</Label>
              <p className="mt-1">{product["truePrice"].toLocaleString("vi-VN", {style:"currency", currency:"VND"})}</p>
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
            <Label className="text-sm font-semibold">Campaign ID</Label>
            <p className="mt-1">{product["campaignId"]}</p>
          </div>

          <div>
            <Label className="text-sm font-semibold">Merchant ID</Label>
            <p className="mt-1">{product["merchantId"]}</p>
          </div>
        </div>
      </div>
    </section>
  )
}