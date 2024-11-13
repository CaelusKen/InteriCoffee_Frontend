'use client'

import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Product } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import FurnitureProductCard from '../../cards/furniture-card-v2'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Search, SortAsc, SortDesc } from 'lucide-react'

interface ProductFilters {
  pageNo: number
  pageSize: number
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  isAscending: boolean
  categoryId?: string
  merchantId?: string
  status?: string
  isAvailability?: boolean
}

const fetchProducts = async (filters: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  // Convert filters to backend format
  const queryParams = {
    'page-no': filters.pageNo,
    'page-size': filters.pageSize,
    'keyword': filters.keyword,
    'min-price': filters.minPrice,
    'max-price': filters.maxPrice,
    'sort-by': filters.sortBy,
    'is-ascending': filters.isAscending,
    'category-id': filters.categoryId,
    'merchant-id': filters.merchantId,
    'status': filters.status,
    'is-availability': filters.isAvailability
  }

  return api.getPaginated<Product>('products', queryParams)
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function BrowseFurnitures() {
  const [filters, setFilters] = useState<ProductFilters>({
    pageNo: 1,
    pageSize: 6,
    isAscending: true,
    sortBy: 'name'
  })
  const [priceRange, setPriceRange] = useState([0, 1000000000])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const debouncedPriceRange = useDebounce(priceRange, 500)

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      keyword: debouncedSearch,
      minPrice: debouncedPriceRange[0],
      maxPrice: debouncedPriceRange[1]
    }))
  }, [debouncedSearch, debouncedPriceRange])

  const productsQuery = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5000, // Optional: Keep the data fresh for 5 seconds
  })

  const products = productsQuery.data?.data.items ?? []
  const total = productsQuery.data?.data.totalCount ?? 0
  const totalPages = Math.ceil(total / filters.pageSize)

  const handlePrevPage = () => {
    setFilters(prev => ({
      ...prev,
      pageNo: Math.max(prev.pageNo - 1, 1)
    }))
  }

  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      pageNo: Math.min(prev.pageNo + 1, totalPages)
    }))
  }

  const toggleSortDirection = () => {
    setFilters(prev => ({
      ...prev,
      isAscending: !prev.isAscending
    }))
  }

  return (
    <div className="flex flex-col space-y-6 p-4 md:p-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Input
            type="text"
            placeholder="Search furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button size="icon" variant="outline">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="createdAt">Date Added</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
          >
            {filters.isAscending ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000000}
            step={1000000}
            className="my-6"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</span>
            <span>{priceRange[1].toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</span>
          </div>
        </div>
      </div>

      {productsQuery.isLoading ? (
        <div className="text-center">Loading...</div>
      ) : productsQuery.isError ? (
        <div className="text-center text-red-500">Error: {(productsQuery.error as Error).message}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <FurnitureProductCard 
                key={product.id}
                name={product.name}
                images={product.images.normalImages}
                price={product.truePrice}
                id={product.id}
                merchant={product.merchantId}
                modelUrl={product.modelTextureUrl}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button 
                onClick={handlePrevPage} 
                disabled={filters.pageNo === 1 || productsQuery.isLoading}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span>
                Page {filters.pageNo} of {totalPages}
              </span>
              <Button 
                onClick={handleNextPage} 
                disabled={filters.pageNo === totalPages || productsQuery.isLoading}
                variant="outline"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}