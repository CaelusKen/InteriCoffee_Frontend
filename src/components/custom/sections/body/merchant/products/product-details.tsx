'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react'

export default function ProductDetails() {
  const [product, setProduct] = useState({
    id: '1',
    name: 'Modern Leather Sofa',
    description: 'A sleek and comfortable leather sofa perfect for modern living rooms.',
    price: 1299.99,
    stock: 15,
    category: 'Sofas',
    style: 'Modern Minimalist',
    badges: ['Leather', 'Comfortable', 'Durable'],
    images: ['https://placehold.co/400', 'https://placehold.co/400', 'https://placehold.co/400', 'https://placehold.co/400']
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Product Stocks
        </Button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="space-x-2">
            <Button variant="destructive" className='bg-yellow-300 hover:bg-yellow-400 text-black'>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" className='bg-red-400 hover:bg-red-500'>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={product.category} readOnly className="bg-background dark:bg-gray-700" />
                </div>
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Input id="style" value={product.style} readOnly className="bg-background dark:bg-gray-700" />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" value={`$${product.price.toFixed(2)}`} readOnly className="bg-background dark:bg-gray-700" />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" value={product.stock} readOnly className="bg-background dark:bg-gray-700" />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description">Description</Label>
                <textarea
                  title='Description'
                  placeholder=''
                  id="description"
                  value={product.description}
                  readOnly
                  className="w-full h-24 mt-1 bg-background dark:bg-gray-700 border border-input rounded-md p-2"
                />
              </div>
              <div className="mt-4">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className='bg-secondary-600 hover:bg-secondary-800 cursor-default'>{badge}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-auto rounded-md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}