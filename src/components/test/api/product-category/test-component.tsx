'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ProductCategory } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchProductCategories = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>("product-categories", { page, pageSize })
}

const fetchProductCategoryById = async (id: string): Promise<ApiResponse<ProductCategory>> => {
  return api.getById<ProductCategory>("product-categories", id)
}

const createProductCategory = async (
  productCategory: Omit<ProductCategory, "id">
): Promise<ApiResponse<ProductCategory>> => {
  return api.post<ProductCategory>("product-categories", productCategory)
}

const updateProductCategory = async (
  productCategory: ProductCategory
): Promise<ApiResponse<ProductCategory>> => {
  return api.patch<ProductCategory>(`product-categories/${productCategory.id}`, productCategory)
}

const deleteProductCategory = async (id: string): Promise<ApiResponse<ProductCategory>> => {
  return api.delete<ProductCategory>(`product-categories/${id}`)
}

export default function ProductCategoryManagement() {
  const [page, setPage] = useState(1)
  const [selectedProductCategoryId, setSelectedProductCategoryId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const productCategoriesQuery = useQuery({
    queryKey: ["productCategories", page],
    queryFn: () => fetchProductCategories(page),
  })

  const productCategories = productCategoriesQuery.data?.data?.items ?? []
  const totalCount = productCategoriesQuery.data?.data?.totalCount ?? 0
  const pageSize = productCategoriesQuery.data?.data?.pageSize ?? 10

  const selectedProductCategoryQuery = useQuery({
    queryKey: ["productCategory", selectedProductCategoryId],
    queryFn: () =>
      selectedProductCategoryId ? fetchProductCategoryById(selectedProductCategoryId) : null,
    enabled: !!selectedProductCategoryId,
  })

  // Mutations
  const createProductCategoryMutation = useMutation({
    mutationFn: createProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] })
    },
  })

  const updateProductCategoryMutation = useMutation({
    mutationFn: updateProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] })
      queryClient.invalidateQueries({
        queryKey: ["productCategory", selectedProductCategoryId],
      })
    },
  })

  const deleteProductCategoryMutation = useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productCategories"] })
      setSelectedProductCategoryId(null)
    },
  })

  // Event handlers
  const handleCreateProductCategory = () => {
    const newProductCategory = {
      name: "New Category",
      description: "A new product category description",
    }
    createProductCategoryMutation.mutate(newProductCategory)
  }

  const handleUpdateProductCategory = () => {
    if (selectedProductCategoryId && selectedProductCategoryQuery.data) {
      const updatedProductCategory = {
        ...selectedProductCategoryQuery.data.data,
        name: `${selectedProductCategoryQuery.data.data.name} (Updated)`,
      }
      updateProductCategoryMutation.mutate(updatedProductCategory)
    }
  }

  const handleDeleteProductCategory = () => {
    if (selectedProductCategoryId) {
      deleteProductCategoryMutation.mutate(selectedProductCategoryId)
    }
  }

  if (productCategoriesQuery.isLoading) return <LoadingPage />
  if (productCategoriesQuery.isError) return <div>Error loading product categories</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Category Management</h1>

      {/* Product Category List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Product Categories</h2>
        {productCategories.length === 0 ? (
          <p>No product categories found.</p>
        ) : (
          <ul className="space-y-2">
            {productCategories.map((category) => (
              <li
                key={category.id}
                className={`cursor-pointer ${
                  selectedProductCategoryId === category.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedProductCategoryId(category.id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="mr-2 px-2 py-1 bg-gray-200 rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((old) => old + 1)}
            disabled={productCategories.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Product Category Details */}
      {selectedProductCategoryId && selectedProductCategoryQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Product Category Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedProductCategoryQuery.data.data.id}</p>
            <p><strong>Name:</strong> {selectedProductCategoryQuery.data.data.name}</p>
            <p><strong>Description:</strong> {selectedProductCategoryQuery.data.data.description}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateProductCategory}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Product Category
        </button>
        <button
          onClick={handleUpdateProductCategory}
          disabled={!selectedProductCategoryId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Product Category
        </button>
        <button
          onClick={handleDeleteProductCategory}
          disabled={!selectedProductCategoryId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Product Category
        </button>
      </div>
    </div>
  )
}