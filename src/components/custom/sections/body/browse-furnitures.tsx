'use client'

import { useState, useEffect } from 'react'
import FurnitureProductCard from '../../cards/furniture-card-v2'
import Filter from '../../filter/filter'
import Pagination from '../../pagination/pagination'

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

const categories = ["All", ...Array.from(new Set(products.map(product => product.category)))]

type FilterOption = {
  type: 'text' | 'select' | 'range' | 'checkbox';
  label: string;
  key: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

const BrowseFurnitures = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    priceRange: [0, 1000] as [number, number],
  })

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  const filterOptions: FilterOption[] = [
    { type: 'text', label: 'Search', key: 'search' },
    { type: 'select', label: 'Category', key: 'category', options: categories },
    { type: 'range', label: 'Price Range', key: 'priceRange', min: 0, max: 1000, step: 10 },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          product.merchant.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory = filters.category === 'All' || product.category === filters.category
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
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
    <div className="container px-10 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Furniture</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Filter
              filters={filters}
              setFilters={setFilters}
              filterOptions={filterOptions}
          />
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
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showFirstLast={true}
            maxPageNumbers={5}
          />
        </div>
      </div>
    </div>
  )
}

export default BrowseFurnitures