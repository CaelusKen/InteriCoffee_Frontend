'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Style } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchStyles = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Style>>> => {
  return api.getPaginated<Style>("styles", { page, pageSize })
}

const fetchStyleById = async (id: string): Promise<ApiResponse<Style>> => {
  return api.getById<Style>("styles", id)
}

const createStyle = async (
  style: Omit<Style, "id" | "createdDate" | "updatedDate">
): Promise<ApiResponse<Style>> => {
  return api.post<Style>("styles", style)
}

const updateStyle = async (
  style: Style
): Promise<ApiResponse<Style>> => {
  return api.patch<Style>(`styles/${style.id}`, style)
}

const deleteStyle = async (id: string): Promise<ApiResponse<Style>> => {
  return api.delete<Style>(`styles/${id}`)
}

export default function StyleManagement() {
  const [page, setPage] = useState(1)
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const stylesQuery = useQuery({
    queryKey: ["styles", page],
    queryFn: () => fetchStyles(page),
  })

  const styles = stylesQuery.data?.data?.items ?? []
  const totalCount = stylesQuery.data?.data?.totalCount ?? 0
  const pageSize = stylesQuery.data?.data?.pageSize ?? 10

  const selectedStyleQuery = useQuery({
    queryKey: ["style", selectedStyleId],
    queryFn: () =>
      selectedStyleId ? fetchStyleById(selectedStyleId) : null,
    enabled: !!selectedStyleId,
  })

  // Mutations
  const createStyleMutation = useMutation({
    mutationFn: createStyle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] })
    },
  })

  const updateStyleMutation = useMutation({
    mutationFn: updateStyle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] })
      queryClient.invalidateQueries({
        queryKey: ["style", selectedStyleId],
      })
    },
  })

  const deleteStyleMutation = useMutation({
    mutationFn: deleteStyle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] })
      setSelectedStyleId(null)
    },
  })

  // Event handlers
  const handleCreateStyle = () => {
    const newStyle = {
      name: "New Style",
      description: "A new style description",
      imageUrl: "https://example.com/style-image.jpg",
      status: "ACTIVE",
    }
    createStyleMutation.mutate(newStyle)
  }

  const handleUpdateStyle = () => {
    if (selectedStyleId && selectedStyleQuery.data) {
      const updatedStyle = {
        ...selectedStyleQuery.data.data,
        name: `${selectedStyleQuery.data.data.name} (Updated)`,
        description: `${selectedStyleQuery.data.data.description} (Updated)`,
      }
      updateStyleMutation.mutate(updatedStyle)
    }
  }

  const handleDeleteStyle = () => {
    if (selectedStyleId) {
      deleteStyleMutation.mutate(selectedStyleId)
    }
  }

  if (stylesQuery.isLoading) return <LoadingPage />
  if (stylesQuery.isError) return <div>Error loading styles</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Style Management</h1>

      {/* Style List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Styles</h2>
        {styles.length === 0 ? (
          <p>No styles found.</p>
        ) : (
          <ul className="space-y-2">
            {styles.map((style) => (
              <li
                key={style.id}
                className={`cursor-pointer ${
                  selectedStyleId === style.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedStyleId(style.id)}
              >
                {style.name}
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
            disabled={styles.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Style Details */}
      {selectedStyleId && selectedStyleQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Style Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedStyleQuery.data.data.id}</p>
            <p><strong>Name:</strong> {selectedStyleQuery.data.data.name}</p>
            <p><strong>Description:</strong> {selectedStyleQuery.data.data.description}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateStyle}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Style
        </button>
        <button
          onClick={handleUpdateStyle}
          disabled={!selectedStyleId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Style
        </button>
        <button
          onClick={handleDeleteStyle}
          disabled={!selectedStyleId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Style
        </button>
      </div>
    </div>
  )
}