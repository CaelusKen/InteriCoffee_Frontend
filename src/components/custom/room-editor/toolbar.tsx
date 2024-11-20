'use client'

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Move, RotateCw, Maximize, Undo, Redo, Save, FolderOpen, Home, Trash2, Plus, Layers } from 'lucide-react'
import { ThemeToggler } from "../buttons/theme-toggler"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Template, ProductCategory, Account, Merchant, Product } from "@/types/frontend/entities"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/service/api"
import { ApiResponse, PaginatedResponse } from "@/types/api"

interface ToolbarProps {
  onAddFurniture: (model: string, category: ProductCategory['id'][]) => void
  transformMode: "translate" | "rotate" | "scale"
  setTransformMode: (mode: "translate" | "rotate" | "scale") => void
  onUndo: () => void
  onRedo: () => void
  onSaveCustomer: () => void
  onSaveMerchant: () => void
  onLoad: (templateId: string) => void
  onOpenRoomDialog: () => void
  onClearAll: () => void
  onAddFloor: () => void
  onAddRoom: () => void
  templates: Template[]
}

const fetchProducts = async (): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>('products')
}

const fetchProductCategories = async (): Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>('product-categories')
}

const fetchAccountByEmail = async (email: string): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchMerchants = async(): Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
  return api.getPaginated<Merchant>('merchants')
}

export default function Toolbar({
  onAddFurniture,
  transformMode,
  setTransformMode,
  onUndo,
  onRedo,
  onSaveCustomer,
  onSaveMerchant,
  onLoad,
  onOpenRoomDialog,
  onClearAll,
  onAddFloor,
  onAddRoom,
  templates,
}: ToolbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoadDrawerOpen, setIsLoadDrawerOpen] = useState(false)

  const { data: session } = useSession()
  const router = useRouter()

  // Data fetching with React Query
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: fetchProductCategories
  })

  const { data: accountData } = useQuery({
    queryKey: ['account', session?.user?.email],
    queryFn: () => fetchAccountByEmail(session?.user?.email || ''),
    enabled: !!session?.user?.email
  })

  const { data: merchantsData } = useQuery({
    queryKey: ['merchants'],
    queryFn: fetchMerchants
  })

  const products = productsData?.data.items ?? []
  const categories = categoriesData?.data.items ?? []
  const merchants = merchantsData?.data.items ?? []
  const account = accountData?.data

  // Memoized handlers
  const handleLoadClick = useCallback(() => {
    setIsLoadDrawerOpen(true)
  }, [])

  const handleLoadTemplate = useCallback((templateId: string) => {
    onLoad(templateId)
    setIsLoadDrawerOpen(false)
  }, [onLoad])

  const getMerchantName = useCallback((merchantId: string) => {
    const merchant = merchants.find((merchant) => merchant.id === merchantId);
    return merchant?.name || ''
  }, [merchants])

  return (
    <div className="flex flex-wrap justify-between items-center p-2 dark:bg-gray-800 border-b">
      <div className="space-x-2 mb-2 sm:mb-0 flex flex-wrap items-center gap-2">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Furniture
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-white text-black">
            <DrawerHeader>
              <DrawerTitle>Choose Furniture</DrawerTitle>
              <DrawerDescription>
                Select the type of furniture you want to add to your room.
              </DrawerDescription>
            </DrawerHeader>
            <Tabs defaultValue={categories[0]?.name} className="w-full px-8">
              <TabsList className="grid px-8" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.name}
                    className="capitalize px-8"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.name} className="py-4">
                  <ScrollArea className="h-[300px] w-full rounded-sm border py-4 border-none">
                    {Object.entries(
                      products
                        .filter((item) => item.categoryIds.includes(category.id))
                        .reduce((acc, item) => {
                          const merchantId = item.merchantId || 'unknown';
                          if (!acc[merchantId]) acc[merchantId] = [];
                          acc[merchantId].push(item);
                          return acc;
                        }, {} as Record<string, Product[]>)
                    ).map(([merchantId, merchantProducts]) => (
                      <div key={merchantId} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {merchantId === account?.merchantId ? 'Your Products' : getMerchantName(merchantId)}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {merchantProducts.map((item) => (
                            <Button
                              key={item.id}
                              onClick={() => {
                                onAddFurniture(item.modelTextureUrl, item.categoryIds);
                                setIsDrawerOpen(false);
                              }}
                              className="w-full p-2 h-auto flex flex-col items-center justify-start hover:bg-secondary-400"
                            >
                              <img 
                                src={item.images.thumbnail} 
                                alt={item.name} 
                                className="w-full h-32 object-cover mb-2 rounded-md"
                              />
                              <span className="text-sm text-center">{item.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="default" className="dark:bg-black dark:text-white w-full px-8">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Button
          onClick={onAddFloor}
          className="hover:bg-primary-600 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <p>Add Floor</p>
          </span>
        </Button>
        <Button
          onClick={onAddRoom}
          className="hover:bg-primary-600 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <p>Add Room</p>
          </span>
        </Button>
      </div>
      <div className="space-x-2 flex flex-wrap items-center">
        <Button
          variant={transformMode === "translate" ? "default" : "outline"}
          size="icon"
          onClick={() => setTransformMode("translate")}
          className="hover:bg-primary-600 hover:text-white"
        >
          <Move className="w-4 h-4" />
        </Button>
        <Button
          variant={transformMode === "rotate" ? "default" : "outline"}
          size="icon"
          onClick={() => setTransformMode("rotate")}
          className="hover:bg-primary-600 hover:text-white"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant={transformMode === "scale" ? "default" : "outline"}
          size="icon"
          onClick={() => setTransformMode("scale")}
          className="hover:bg-primary-600 hover:text-white"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-x-2 flex flex-wrap items-center">
        <Button
          onClick={onUndo}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRedo}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Redo className="w-4 h-4" />
        </Button>
        {session?.user.role === "CUSTOMER" && (
          <Button
            onClick={onSaveCustomer}
            className="hover:bg-primary-600 hover:text-white"
          >
            Save Design
          </Button>
        )}
        {session?.user.role === "CONSULTANT" && (
          <Button
            onClick={onSaveMerchant}
            className="hover:bg-primary-600 hover:text-white"
          >
            Save as Template
          </Button>
        )}
        {!session && (
          <Button
            onClick={() => router.push("/login")}
            className="hover:bg-primary-600 hover:text-white"
          >
            Login to Save
          </Button>
        )}
        <Button
          onClick={handleLoadClick}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <FolderOpen className="w-4 h-4" />
        </Button>
        <Button
          onClick={onOpenRoomDialog}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Home className="w-4 h-4" />
        </Button>
        <Button
          onClick={onClearAll}
          size="icon"
          className="hover:bg-primary-600 hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <ThemeToggler />
        <Drawer open={isLoadDrawerOpen} onOpenChange={setIsLoadDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Load Template</DrawerTitle>
              <DrawerDescription>
                Choose a template to load
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[300px] p-4">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className="w-full justify-start mb-2"
                >
                  {template.name} ({template.products.length} items)
                </Button>
              ))}
            </ScrollArea>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}