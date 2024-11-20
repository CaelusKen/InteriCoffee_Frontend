"use client";

import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Product } from "@/types/frontend/entities";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import FurnitureProductCard from "../../cards/furniture-card-v2";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";

const fetchProducts = async (): Promise<
  ApiResponse<PaginatedResponse<Product>>
> => {
  return api.getPaginated<Product>("products");
};

export default function BrowseFurnitures() {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('')

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const products = productsQuery.data?.data.items ?? [];
  
  //For searching (only for product name)
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  //For Paginnation
  const total = filteredProducts.length ?? 0;
  const totalPages = Math.ceil(total / pageSize); //Calculate total pages needed
  const paginatedProducts = products.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex justify-between w-full mt-4">
        {/* Search Bar */}
        <div className="flex justify-start w-fit items-center space-x-2">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
  
        {/* Pagination Section */}
        <div className="flex justify-end items-center w-full gap-4">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            variant="outline"
          >
            <ChevronLeft className="mr-2" />
            Previous
          </Button>
          <p>
            Page {page} of {totalPages}, &nbsp;
          </p>
          {/* Page Size Selector */}
          <div className="flex items-center space-x-4 w-[280px]">
              <label htmlFor="pageSize" className="w-full">
                Items per page:
              </label>
              <Select
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1); // Reset to first page to avoid invalid states
                }}
                value={String(pageSize)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page size" />
                </SelectTrigger>
                <SelectContent>
                  {[6, 12, 24, 60].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
  
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            variant="outline"
          >
            Next
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>

      {productsQuery.isLoading ? (
        <div className="text-center">Loading...</div>
      ) : productsQuery.isError ? (
        <div className="text-center text-red-500">
          Error: {(productsQuery.error as Error).message}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {paginatedProducts.map((product) => (
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
        </>
      )}
    </div>
  );
}
