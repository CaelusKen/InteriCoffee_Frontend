'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Merchant } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchMerchants = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
  return api.getPaginated<Merchant>("merchants", { page, pageSize })
}

const fetchMerchantById = async (id: string): Promise<ApiResponse<Merchant>> => {
  return api.getById<Merchant>("merchants", id)
}

const createMerchant = async (
  merchant: Omit<Merchant, "id" | "orderIncomes">
): Promise<ApiResponse<Merchant>> => {
  return api.post<Merchant>("merchants", merchant)
}

const updateMerchant = async (
  merchant: Merchant
): Promise<ApiResponse<Merchant>> => {
  return api.patch<Merchant>(`merchants/${merchant.id}`, merchant)
}

const deleteMerchant = async (id: string): Promise<ApiResponse<Merchant>> => {
  return api.delete<Merchant>(`merchants/${id}`)
}

export default function MerchantManagement() {
  const [page, setPage] = useState(1)
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const merchantsQuery = useQuery({
    queryKey: ["merchants", page],
    queryFn: () => fetchMerchants(page),
  })

  const merchants = merchantsQuery.data?.data?.items ?? []
  const totalCount = merchantsQuery.data?.data?.totalCount ?? 0
  const pageSize = merchantsQuery.data?.data?.pageSize ?? 10

  const selectedMerchantQuery = useQuery({
    queryKey: ["merchant", selectedMerchantId],
    queryFn: () =>
      selectedMerchantId ? fetchMerchantById(selectedMerchantId) : null,
    enabled: !!selectedMerchantId,
  })

  // Mutations
  const createMerchantMutation = useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] })
    },
  })

  const updateMerchantMutation = useMutation({
    mutationFn: updateMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] })
      queryClient.invalidateQueries({
        queryKey: ["merchant", selectedMerchantId],
      })
    },
  })

  const deleteMerchantMutation = useMutation({
    mutationFn: deleteMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] })
      setSelectedMerchantId(null)
    },
  })

  // Event handlers
  const handleCreateMerchant = () => {
    const newMerchant = {
      name: "New Merchant",
      email: "newmerchant@example.com",
      address: "123 New St, City, Country",
      phoneNumber: "1234567890",
      logoUrl: "https://example.com/logo.png",
      description: "A new merchant description",
      status: "ACTIVE",
      merchantCode: "NM001",
      policyDocument: "https://example.com/policy.pdf",
      website: "https://newmerchant.com",
    }
    createMerchantMutation.mutate(newMerchant)
  }

  const handleUpdateMerchant = () => {
    if (selectedMerchantId && selectedMerchantQuery.data) {
      const updatedMerchant = {
        ...selectedMerchantQuery.data.data,
        name: `${selectedMerchantQuery.data.data.name} (Updated)`,
      }
      updateMerchantMutation.mutate(updatedMerchant)
    }
  }

  const handleDeleteMerchant = () => {
    if (selectedMerchantId) {
      deleteMerchantMutation.mutate(selectedMerchantId)
    }
  }

  if (merchantsQuery.isLoading) return <LoadingPage />
  if (merchantsQuery.isError) return <div>Error loading merchants</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Merchant Management</h1>

      {/* Merchant List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Merchants</h2>
        {merchants.length === 0 ? (
          <p>No merchants found.</p>
        ) : (
          <ul className="space-y-2">
            {merchants.map((merchant) => (
              <li
                key={merchant.id}
                className={`cursor-pointer ${
                  selectedMerchantId === merchant.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedMerchantId(merchant.id)}
              >
                {merchant.name} ({merchant.merchantCode})
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
            disabled={merchants.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Merchant Details */}
      {selectedMerchantId && selectedMerchantQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Merchant Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>Name:</strong> {selectedMerchantQuery.data.data.name}</p>
            <p><strong>Email:</strong> {selectedMerchantQuery.data.data.email}</p>
            <p><strong>Address:</strong> {selectedMerchantQuery.data.data.address}</p>
            <p><strong>Phone Number:</strong> {selectedMerchantQuery.data.data.phoneNumber}</p>
            <p><strong>Logo URL:</strong> {selectedMerchantQuery.data.data.logoUrl}</p>
            <p><strong>Description:</strong> {selectedMerchantQuery.data.data.description}</p>
            <p><strong>Status:</strong> {selectedMerchantQuery.data.data.status}</p>
            <p><strong>Merchant Code:</strong> {selectedMerchantQuery.data.data.merchantCode}</p>
            <p><strong>Policy Document:</strong> {selectedMerchantQuery.data.data.policyDocument}</p>
            <p><strong>Website:</strong> {selectedMerchantQuery.data.data.website}</p>
            <p><strong>Order Incomes:</strong> {selectedMerchantQuery.data.data.orderIncomes.length}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateMerchant}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Merchant
        </button>
        <button
          onClick={handleUpdateMerchant}
          disabled={!selectedMerchantId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Merchant
        </button>
        <button
          onClick={handleDeleteMerchant}
          disabled={!selectedMerchantId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Merchant
        </button>
      </div>
    </div>
  )
}