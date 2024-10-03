'use client'

import { useState, useEffect } from 'react'
import FurnitureProductCard from '../../cards/furniture-card-v2'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

//Sample Product Data
const products = [
  {
    id: '1',
    name: "Modern Chair",
    merchant: "FurniCraft",
    images: [
      { src: "https://placehold.co/300", alt: "Modern Chair" },
      { src: "https://placehold.co/300", alt: "Modern Chair" },
      { src: "https://placehold.co/300", alt: "Modern Chair" }
    ],
    modelUrl: "/assets/3D/modern-chair.glb",
    price: 199.99,
    category: "Chairs",
  },
  {
    id: '2',
    name: "Classic Coffee Table",
    merchant: "WoodWorks",
    images: [
      { src: "https://placehold.co/400", alt: "Classic Coffee Table" },
      { src: "https://placehold.co/400", alt: "Classic Coffee Table" },
      { src: "https://placehold.co/400", alt: "Classic Coffee Table" }
    ],
    modelUrl: "/assets/3D/classic-coffee-table.glb",
    price: 299.99,
    category: "Tables",
  },
  {
    id: '3',
    name: "Cozy Sofa",
    merchant: "ComfortZone",
    images: [
      { src: "https://placehold.co/500", alt: "Cozy Sofa" },
      { src: "https://placehold.co/500", alt: "Cozy Sofa" },
      { src: "https://placehold.co/500", alt: "Cozy Sofa" }
    ],
    modelUrl: "/assets/3D/sofa.glb",
    price: 599.99,
    category: "Sofas",
  },
  {
    id: '4',
    name: "Dining Table",
    merchant: "DineDesign",
    images: [
      { src: "https://placehold.co/600", alt: "Dining Table" },
      { src: "https://placehold.co/600", alt: "Dining Table" },
      { src: "https://placehold.co/600", alt: "Dining Table" }
    ],
    modelUrl: "/assets/3D/table.glb",
    price: 399.99,
    category: "Tables",
  },
  {
    id: '5',
    name: "Workbench",
    merchant: "CraftMaster",
    images: [
      { src: "https://placehold.co/700", alt: "Workbench" },
      { src: "https://placehold.co/700", alt: "Workbench" },
      { src: "https://placehold.co/700", alt: "Workbench" }
    ],
    modelUrl: "/assets/3D/workbench.glb",
    price: 249.99,
    category: "Workspaces",
  },
  {
    id: '6',
    name: "Coffee Shop Table",
    merchant: "CafeChic",
    images: [
      { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
      { src: "https://placehold.co/800", alt: "Coffee Shop Table" },
      { src: "https://placehold.co/800", alt: "Coffee Shop Table" }
    ],
    modelUrl: "/assets/3D/coffee_shop.glb",
    price: 179.99,
    category: "Tables",
  },
  // Add more products as needed
]

const categories = ["All", "Chairs", "Tables", "Sofas", "Workspaces"]

const FilterComponent = ({ filters, setFilters }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className='bg-white text-black'>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Price Range</Label>
        <div className="flex items-center space-x-4">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-24"
          />
          <Slider
            min={0}
            max={1000}
            step={10}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-24"
          />
        </div>
      </div>
      <div>
        <Label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.inStock}
            onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked })}
          />
          <span>In Stock Only</span>
        </Label>
      </div>
    </div>
  )
}

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

const BrowseFurnitures = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category === 'All' || product.category === filters.category) &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice
    )
  })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  return (
    <div className="container mx-auto px-10 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Furniture</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <FilterComponent filters={filters} setFilters={setFilters} />
        </div>
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <FurnitureProductCard key={product.id} {...product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No products found. Try adjusting your filters.</p>
          )}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default BrowseFurnitures