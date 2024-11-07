'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Review } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchProductReviews = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Review>>> => {
  return api.getPaginated<Review>("product-reviews", { page, pageSize })
}

const fetchProductReviewById = async (id: string): Promise<ApiResponse<Review>> => {
  return api.getById<Review>("product-reviews", id)
}

const createProductReview = async (
  productReview: Omit<Review, "id" | "createdDate" | "updatedDate">
): Promise<ApiResponse<Review>> => {
  return api.post<Review>("product-reviews", productReview)
}

const updateProductReview = async (
  productReview: Review
): Promise<ApiResponse<Review>> => {
  return api.patch<Review>(`product-reviews/${productReview.id}`, productReview)
}

const deleteProductReview = async (id: string): Promise<ApiResponse<Review>> => {
  return api.delete<Review>(`product-reviews/${id}`)
}

export default function ProductReviewManagement() {
  const [page, setPage] = useState(1)
  const [selectedProductReviewId, setSelectedProductReviewId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const productReviewsQuery = useQuery({
    queryKey: ["productReviews", page],
    queryFn: () => fetchProductReviews(page),
  })

  const productReviews = productReviewsQuery.data?.data?.items ?? []
  const totalCount = productReviewsQuery.data?.data?.totalCount ?? 0
  const pageSize = productReviewsQuery.data?.data?.pageSize ?? 10

  const selectedProductReviewQuery = useQuery({
    queryKey: ["productReview", selectedProductReviewId],
    queryFn: () =>
      selectedProductReviewId ? fetchProductReviewById(selectedProductReviewId) : null,
    enabled: !!selectedProductReviewId,
  })

  // Mutations
  const createProductReviewMutation = useMutation({
    mutationFn: createProductReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] })
    },
  })

  const updateProductReviewMutation = useMutation({
    mutationFn: updateProductReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] })
      queryClient.invalidateQueries({
        queryKey: ["productReview", selectedProductReviewId],
      })
    },
  })

  const deleteProductReviewMutation = useMutation({
    mutationFn: deleteProductReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productReviews"] })
      setSelectedProductReviewId(null)
    },
  })

  // Event handlers
  const handleCreateProductReview = () => {
    const newProductReview = {
      productId: "product123",
      accountId: "account456",
      rating: 4,
      comment: "Great product!",
      images: ["https://example.com/review-image1.jpg", "https://example.com/review-image2.jpg"],
    }
    createProductReviewMutation.mutate(newProductReview)
  }

  const handleUpdateProductReview = () => {
    if (selectedProductReviewId && selectedProductReviewQuery.data) {
      const updatedProductReview = {
        ...selectedProductReviewQuery.data.data,
        rating: 5,
        comment: "Updated: Excellent product!",
      }
      updateProductReviewMutation.mutate(updatedProductReview)
    }
  }

  const handleDeleteProductReview = () => {
    if (selectedProductReviewId) {
      deleteProductReviewMutation.mutate(selectedProductReviewId)
    }
  }

  if (productReviewsQuery.isLoading) return <LoadingPage />
  if (productReviewsQuery.isError) return <div>Error loading product reviews</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Review Management</h1>

      {/* Product Review List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Product Reviews</h2>
        {productReviews.length === 0 ? (
          <p>No product reviews found.</p>
        ) : (
          <ul className="space-y-2">
            {productReviews.map((review) => (
              <li
                key={review.id}
                className={`cursor-pointer ${
                  selectedProductReviewId === review.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedProductReviewId(review.id)}
              >
                Review for Product {review.productId} - Rating: {review.rating}
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
            disabled={productReviews.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Product Review Details */}
      {selectedProductReviewId && selectedProductReviewQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Product Review Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedProductReviewQuery.data.data.id}</p>
            <p><strong>Product ID:</strong> {selectedProductReviewQuery.data.data.productId}</p>
            <p><strong>Account ID:</strong> {selectedProductReviewQuery.data.data.accountId}</p>
            <p><strong>Rating:</strong> {selectedProductReviewQuery.data.data.rating}</p>
            <p><strong>Comment:</strong> {selectedProductReviewQuery.data.data.comment}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateProductReview}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Product Review
        </button>
        <button
          onClick={handleUpdateProductReview}
          disabled={!selectedProductReviewId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Product Review
        </button>
        <button
          onClick={handleDeleteProductReview}
          disabled={!selectedProductReviewId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Product Review
        </button>
      </div>
    </div>
  )
}