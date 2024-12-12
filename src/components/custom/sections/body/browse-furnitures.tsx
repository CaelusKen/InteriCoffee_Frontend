"use client";

import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Product, ProductCategory } from "@/types/frontend/entities";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const fetchProducts = async (): Promise<
  ApiResponse<PaginatedResponse<Product>>
> => {
  return api.getPaginated<Product>("products");
};

const fetchProductCategory = async (): Promise<
  ApiResponse<PaginatedResponse<ProductCategory>>
> => {
  return api.getPaginated<ProductCategory>("product-categories");
};

const fetchProductCategoryById = async (
  id: string
): Promise<ApiResponse<ProductCategory>> => {
  return api.getById<ProductCategory>(`product-categories`, id);
};

export default function BrowseFurnitures() {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>(""); //For searching
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); //For sorting ascending and descending
  const [sortField, setSortField] = useState<keyof Product>("name"); //For sorting products
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchProductCategory(),
  });

  //For searching and filtering products
  const filteredProducts = useMemo(() => {
    const products = productsQuery.data?.data.items ?? [];

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedCategories.length === 0 ||
            selectedCategories.some((cat) =>
              product.categoryIds.includes(cat)
            )) &&
          product.truePrice >= priceRange[0] &&
          product.truePrice <= priceRange[1]
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      });
  }, [
    productsQuery.data?.data.items,
    searchQuery,
    selectedCategories,
    sortOrder,
    sortField,
    priceRange,
  ]);

  //For Paginnation
  const total = filteredProducts.length ?? 0;
  const totalPages = Math.ceil(total / pageSize); //Calculate total pages needed
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handlePriceRangeChange = (newValue: number[]) => {
    setPriceRange([newValue[0], newValue[1]]);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div className="flex flex-col md:flex-row justify-between w-full mt-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
          {/* Search Bar */}
          <div className="flex items-center space-x-2 w-full md:w-1/2">
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

          {/* Sort Options */}
          <div className="flex items-center space-x-2 w-full md:w-1/2">
            <Select
              onValueChange={(value) => setSortField(value as keyof Product)}
              value={sortField}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="truePrice">Price</SelectItem>
                {/* Add more sorting options as needed */}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-end space-x-2 w-full md:w-1/3">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
            value={String(pageSize)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              {[12, 24, 48, 96].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-fit md:w-[240px]">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4">
                {categoriesQuery.data?.data.items.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCategories((prev) =>
                          checked
                            ? [...prev, category.id]
                            : prev.filter((id) => id !== category.id)
                        );
                      }}
                    />
                    <Label htmlFor={category.id}>{category.name}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger>Price Range</AccordionTrigger>
              <AccordionContent className="my-4">
                <div className="space-y-4">
                  <Slider
                    min={priceRange[0]}
                    max={priceRange[1]}
                    step={100000}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                  />
                  <div className="flex justify-between">
                    <span>{priceRange[0].toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
                    <span>{priceRange[1].toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Product Grid */}
        <div className="w-full">
          {productsQuery.isLoading ? (
            <div className="text-center">Loading...</div>
          ) : productsQuery.isError ? (
            <div className="text-center text-red-500">
              Error: {(productsQuery.error as Error).message}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <FurnitureProductCard
                  key={product.id}
                  name={product.name}
                  images={product.images.normalImages as string[]}
                  modelUrl={product.modelTextureUrl}
                  price={product.truePrice}
                  id={product.id}
                  merchant={product.merchantId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
