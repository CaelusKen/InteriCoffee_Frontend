'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { APIDesign } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchDesigns = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<APIDesign>>> => {
  return api.getPaginated<APIDesign>("designs", { page, pageSize })
}

const fetchDesignById = async (id: string): Promise<ApiResponse<APIDesign>> => {
  return api.getById<APIDesign>("designs", id)
}

const createDesign = async (
  design: Omit<APIDesign, "id" | "createdDate" | "updateDate">
): Promise<ApiResponse<APIDesign>> => {
  return api.post<APIDesign>("designs", design)
}

const updateDesign = async (
  design: APIDesign
): Promise<ApiResponse<APIDesign>> => {
  return api.patch<APIDesign>(`designs/${design.id}`, design)
}

const deleteDesign = async (id: string): Promise<ApiResponse<APIDesign>> => {
  return api.delete<APIDesign>(`designs/${id}`)
}

export default function DesignManagement() {
  const [page, setPage] = useState(1)
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const designsQuery = useQuery({
    queryKey: ["designs", page],
    queryFn: () => fetchDesigns(page),
  })

  const designs = designsQuery.data?.data?.items ?? []
  const totalCount = designsQuery.data?.data?.totalCount ?? 0
  const pageSize = designsQuery.data?.data?.pageSize ?? 10

  const selectedDesignQuery = useQuery({
    queryKey: ["design", selectedDesignId],
    queryFn: () =>
      selectedDesignId ? fetchDesignById(selectedDesignId) : null,
    enabled: !!selectedDesignId,
  })

  // Mutations
  const createDesignMutation = useMutation({
    mutationFn: createDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] })
    },
  })

  const updateDesignMutation = useMutation({
    mutationFn: updateDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] })
      queryClient.invalidateQueries({
        queryKey: ["design", selectedDesignId],
      })
    },
  })

  const deleteDesignMutation = useMutation({
    mutationFn: deleteDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] })
      setSelectedDesignId(null)
    },
  })

  // Event handlers
  const handleCreateDesign = () => {
    const newDesign = {
      name: "New Design",
      description: "A new design description",
      status: "DRAFT",
      type: "ROOM",
      floors: [],
      accountId: "account123",
      templateId: "template456",
      styleId: "style789",
    }
    createDesignMutation.mutate(newDesign)
  }

  const handleUpdateDesign = () => {
    if (selectedDesignId && selectedDesignQuery.data) {
      const updatedDesign = {
        ...selectedDesignQuery.data.data,
        name: `${selectedDesignQuery.data.data.name} (Updated)`,
      }
      updateDesignMutation.mutate(updatedDesign)
    }
  }

  const handleDeleteDesign = () => {
    if (selectedDesignId) {
      deleteDesignMutation.mutate(selectedDesignId)
    }
  }

  if (designsQuery.isLoading) return <LoadingPage />
  if (designsQuery.isError) return <div>Error loading designs</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Design Management</h1>

      {/* Design List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Designs</h2>
        {designs.length === 0 ? (
          <p>No designs found.</p>
        ) : (
          <ul className="space-y-2">
            {designs.map((design) => (
              <li
                key={design.id}
                className={`cursor-pointer ${
                  selectedDesignId === design.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedDesignId(design.id)}
              >
                {design.name} ({design.type})
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
            disabled={designs.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Design Details */}
      {selectedDesignId && selectedDesignQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Design Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>Name:</strong> {selectedDesignQuery.data.data.name}</p>
            <p><strong>Description:</strong> {selectedDesignQuery.data.data.description}</p>
            <p><strong>Status:</strong> {selectedDesignQuery.data.data.status}</p>
            <p><strong>Type:</strong> {selectedDesignQuery.data.data.type}</p>
            <p><strong>Floors:</strong> {selectedDesignQuery.data.data.floors.length}</p>
            <p><strong>Account ID:</strong> {selectedDesignQuery.data.data.accountId}</p>
            <p><strong>Template ID:</strong> {selectedDesignQuery.data.data.templateId}</p>
            <p><strong>Style ID:</strong> {selectedDesignQuery.data.data.styleId}</p>
            <p><strong>Created Date:</strong> {selectedDesignQuery.data.data.createdDate.toLocaleString()}</p>
            <p><strong>Updated Date:</strong> {selectedDesignQuery.data.data.updateDate.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateDesign}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Design
        </button>
        <button
          onClick={handleUpdateDesign}
          disabled={!selectedDesignId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Design
        </button>
        <button
          onClick={handleDeleteDesign}
          disabled={!selectedDesignId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Design
        </button>
      </div>
    </div>
  )
}