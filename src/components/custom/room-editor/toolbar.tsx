'use client'

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Move, RotateCw, Maximize, Undo, Redo, Save, FolderOpen, Home, Trash2, Plus, Layers, ChevronRight } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Template, ProductCategory, Account, Merchant, Product } from "@/types/frontend/entities"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/service/api"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { Furniture } from "@/types/room-editor"

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
  pinnedFurniture: Furniture[]
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
  pinnedFurniture,
}: ToolbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoadDrawerOpen, setIsLoadDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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

  const renderCategoryMenu = (categories: ProductCategory[]) => {
    return categories.map((category) => (
      <DropdownMenuSub key={category.id}>
        <DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {merchants.map((merchant) => {
              const merchantProducts = products.filter(
                (product) =>
                  product.categoryIds.includes(category.id) &&
                  product.merchantId === merchant.id
              );

              if (merchantProducts.length === 0) return null;

              return (
                <DropdownMenuSub key={merchant.id}>
                  <DropdownMenuSubTrigger>{merchant.name}</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {merchantProducts.map((product) => (
                        <DropdownMenuItem
                          key={product.id}
                          onSelect={() => {
                            onAddFurniture(product.modelTextureUrl, product.categoryIds);
                            setIsDrawerOpen(false);
                          }}
                        >
                          {product.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    ));
  };

  return (
    <div className="flex flex-wrap justify-between items-center p-2 dark:bg-gray-800 border-b">
      <div className="space-x-2 mb-2 sm:mb-0 flex flex-wrap items-center gap-2">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Furniture
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {renderCategoryMenu(categories)}
          </DropdownMenuContent>
        </DropdownMenu>
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
      {pinnedFurniture.length > 0 && (
        <div className="w-full mt-2 overflow-x-auto">
          <ScrollArea className="w-full">
            <div className="flex space-x-2">
              {pinnedFurniture.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => onAddFurniture(item.model, item.category)}
                  className="p-2 h-auto flex flex-col items-center justify-start hover:bg-secondary-400"
                >
                  <img
                    src={item.model}
                    alt={item.name}
                    className="w-12 h-12 object-cover mb-1 rounded-md"
                  />
                  <span className="text-xs text-center">{item.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

