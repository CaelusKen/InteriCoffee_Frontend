'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { SaleCampaign } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchSaleCampaigns = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<SaleCampaign>>> => {
  return api.getPaginated<SaleCampaign>("sale-campaigns", { page, pageSize })
}

const fetchSaleCampaignById = async (id: string): Promise<ApiResponse<SaleCampaign>> => {
  return api.getById<SaleCampaign>("sale-campaigns", id)
}

const createSaleCampaign = async (
  saleCampaign: Omit<SaleCampaign, "id" | "createdDate" | "updatedDate">
): Promise<ApiResponse<SaleCampaign>> => {
  return api.post<SaleCampaign>("sale-campaigns", saleCampaign)
}

const updateSaleCampaign = async (
  saleCampaign: SaleCampaign
): Promise<ApiResponse<SaleCampaign>> => {
  return api.patch<SaleCampaign>(`sale-campaigns/${saleCampaign.id}`, saleCampaign)
}

const deleteSaleCampaign = async (id: string): Promise<ApiResponse<SaleCampaign>> => {
  return api.delete<SaleCampaign>(`sale-campaigns/${id}`)
}

export default function SaleCampaignManagement() {
  const [page, setPage] = useState(1)
  const [selectedSaleCampaignId, setSelectedSaleCampaignId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const saleCampaignsQuery = useQuery({
    queryKey: ["saleCampaigns", page],
    queryFn: () => fetchSaleCampaigns(page),
  })

  const saleCampaigns = saleCampaignsQuery.data?.data?.items ?? []
  const totalCount = saleCampaignsQuery.data?.data?.totalCount ?? 0
  const pageSize = saleCampaignsQuery.data?.data?.pageSize ?? 10

  const selectedSaleCampaignQuery = useQuery({
    queryKey: ["saleCampaign", selectedSaleCampaignId],
    queryFn: () =>
      selectedSaleCampaignId ? fetchSaleCampaignById(selectedSaleCampaignId) : null,
    enabled: !!selectedSaleCampaignId,
  })

  // Mutations
  const createSaleCampaignMutation = useMutation({
    mutationFn: createSaleCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saleCampaigns"] })
    },
  })

  const updateSaleCampaignMutation = useMutation({
    mutationFn: updateSaleCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saleCampaigns"] })
      queryClient.invalidateQueries({
        queryKey: ["saleCampaign", selectedSaleCampaignId],
      })
    },
  })

  const deleteSaleCampaignMutation = useMutation({
    mutationFn: deleteSaleCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saleCampaigns"] })
      setSelectedSaleCampaignId(null)
    },
  })

  // Event handlers
  const handleCreateSaleCampaign = () => {
    const newSaleCampaign = {
      name: "New Sale Campaign",
      description: "A new sale campaign description",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      discountPercentage: 10,
      status: "ACTIVE",
      bannerImage: "https://example.com/sale-banner.jpg",
      merchantId: "merchant123",
      value: 20,
      campaignProductIds: ["1", "2", "3"]  
    }
    createSaleCampaignMutation.mutate(newSaleCampaign)
  }

  const handleUpdateSaleCampaign = () => {
    if (selectedSaleCampaignId && selectedSaleCampaignQuery.data) {
      const updatedSaleCampaign = {
        ...selectedSaleCampaignQuery.data.data,
        name: `${selectedSaleCampaignQuery.data.data.name} (Updated)`,
        discountPercentage: selectedSaleCampaignQuery.data.data.value + 5,
      }
      updateSaleCampaignMutation.mutate(updatedSaleCampaign)
    }
  }

  const handleDeleteSaleCampaign = () => {
    if (selectedSaleCampaignId) {
      deleteSaleCampaignMutation.mutate(selectedSaleCampaignId)
    }
  }

  if (saleCampaignsQuery.isLoading) return <LoadingPage />
  if (saleCampaignsQuery.isError) return <div>Error loading sale campaigns</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sale Campaign Management</h1>

      {/* Sale Campaign List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Sale Campaigns</h2>
        {saleCampaigns.length === 0 ? (
          <p>No sale campaigns found.</p>
        ) : (
          <ul className="space-y-2">
            {saleCampaigns.map((campaign) => (
              <li
                key={campaign.id}
                className={`cursor-pointer ${
                  selectedSaleCampaignId === campaign.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedSaleCampaignId(campaign.id)}
              >
                {campaign.name} - {campaign.status} ({campaign.value}% off)
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
            disabled={saleCampaigns.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Sale Campaign Details */}
      {selectedSaleCampaignId && selectedSaleCampaignQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Sale Campaign Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedSaleCampaignQuery.data.data.id}</p>
            <p><strong>Name:</strong> {selectedSaleCampaignQuery.data.data.name}</p>
            <p><strong>Description:</strong> {selectedSaleCampaignQuery.data.data.description}</p>
            <p><strong>Start Date:</strong> {new Date(selectedSaleCampaignQuery.data.data.startDate).toLocaleString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedSaleCampaignQuery.data.data.endDate).toLocaleString()}</p>
            <p><strong>Discount Percentage:</strong> {selectedSaleCampaignQuery.data.data.value}%</p>
            <p><strong>Status:</strong> {selectedSaleCampaignQuery.data.data.status}</p>
            <p><strong>Merchant ID:</strong> {selectedSaleCampaignQuery.data.data.merchantId}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateSaleCampaign}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Sale Campaign
        </button>
        <button
          onClick={handleUpdateSaleCampaign}
          disabled={!selectedSaleCampaignId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Sale Campaign
        </button>
        <button
          onClick={handleDeleteSaleCampaign}
          disabled={!selectedSaleCampaignId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Sale Campaign
        </button>
      </div>
    </div>
  )
}