'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Product } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchProducts = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>("products", { page, pageSize })
}

const fetchProductById = async (id: string): Promise<ApiResponse<Product>> => {
  return api.getById<Product>("products", id)
}

const createProduct = async (
  product: Omit<Product, "id" | "createdDate" | "updatedDate">
): Promise<ApiResponse<Product>> => {
  return api.post<Product>("products", product)
}

const updateProduct = async (
  product: Product
): Promise<ApiResponse<Product>> => {
  return api.patch<Product>(`products/${product.id}`, product)
}

const deleteProduct = async (id: string): Promise<ApiResponse<Product>> => {
  return api.delete<Product>(`products/${id}`)
}

export default function ProductManagement() {
  const [page, setPage] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const productsQuery = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
  })

  const products = productsQuery.data?.data?.items ?? []
  const totalCount = productsQuery.data?.data?.totalCount ?? 0
  const pageSize = productsQuery.data?.data?.pageSize ?? 10

  const selectedProductQuery = useQuery({
    queryKey: ["product", selectedProductId],
    queryFn: () =>
      selectedProductId ? fetchProductById(selectedProductId) : null,
    enabled: !!selectedProductId,
  })

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({
        queryKey: ["product", selectedProductId],
      })
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setSelectedProductId(null)
    },
  })

  // Event handlers
  const handleCreateProduct = () => {
    const newProduct = {
      categoryIds: ["category1", "category2"],
      name: "New Product",
      description: "A new product description",
      images: {
        thumbnail: "https://example.com/thumbnail.jpg",
        normalImages: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      },
      sellingPrice: 100,
      discount: 0,
      truePrice: 100,
      quantity: 50,
      status: "ACTIVE",
      dimensions: "10x10x10",
      materials: ["material1", "material2"],
      modelTextureUrl: "https://example.com/texture.jpg",
      campaignId: "",
      merchantId: "merchant123",
    }
    createProductMutation.mutate(newProduct)
  }

  const handleUpdateProduct = () => {
    if (selectedProductId && selectedProductQuery.data) {
      const updatedProduct = {
        ...selectedProductQuery.data.data,
        name: `${selectedProductQuery.data.data.name} (Updated)`,
      }
      updateProductMutation.mutate(updatedProduct)
    }
  }

  const handleDeleteProduct = () => {
    if (selectedProductId) {
      deleteProductMutation.mutate(selectedProductId)
    }
  }

  if (productsQuery.isLoading) return <LoadingPage />
  if (productsQuery.isError) return <div>Error loading products</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Product List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product.id}
                className={`cursor-pointer ${
                  selectedProductId === product.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedProductId(product.id)}
              >
                {product.name} - ${product.sellingPrice}
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
            disabled={products.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Product Details */}
      {selectedProductId && selectedProductQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Product Details</h2>
          <div className="bg-black p-4 rounded-lg grid grid-cols-2">
            <p><strong>Name:</strong> {selectedProductQuery.data.data.name}</p>
            <p><strong>Description:</strong> {selectedProductQuery.data.data.description}</p>
            <p><strong>Selling Price:</strong> ${selectedProductQuery.data.data.sellingPrice}</p>
            <p><strong>True Price:</strong> ${selectedProductQuery.data.data.truePrice}</p>
            <p><strong>Discount:</strong> {selectedProductQuery.data.data.discount}%</p>
            <p><strong>Quantity:</strong> {selectedProductQuery.data.data.quantity}</p>
            <p><strong>Status:</strong> {selectedProductQuery.data.data.status}</p>
            <p><strong>Dimensions:</strong> {selectedProductQuery.data.data.dimensions}</p>
            <p><strong>Materials:</strong> {selectedProductQuery.data.data.materials.join(", ")}</p>
            <p><strong>Merchant ID:</strong> {selectedProductQuery.data.data.merchantId}</p>
            <p><strong>Campaign ID:</strong> {selectedProductQuery.data.data.campaignId || 'N/A'}</p>
            <p><strong>Created Date:</strong> {selectedProductQuery.data.data.createdDate.toLocaleString()}</p>
            <p><strong>Updated Date:</strong> {selectedProductQuery.data.data.updatedDate.toLocaleString()}</p>
            <div>
              <p><strong>Image Preview:</strong></p>
              <img src={selectedProductQuery.data.data.images.thumbnail} alt={selectedProductQuery.data.data.name} className="w-[240px] h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateProduct}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Product
        </button>
        <button
          onClick={handleUpdateProduct}
          disabled={!selectedProductId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Product
        </button>
        <button
          onClick={handleDeleteProduct}
          disabled={!selectedProductId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Product
        </button>
      </div>
    </div>
  )
}