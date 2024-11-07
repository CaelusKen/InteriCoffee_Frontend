'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Voucher } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchVouchers = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Voucher>>> => {
  return api.getPaginated<Voucher>("vouchers", { page, pageSize })
}

const fetchVoucherById = async (id: string): Promise<ApiResponse<Voucher>> => {
  return api.getById<Voucher>("vouchers", id)
}

const createVoucher = async (
  voucher: Omit<Voucher, "id" | "createdDate" | "updatedDate">
): Promise<ApiResponse<Voucher>> => {
  return api.post<Voucher>("vouchers", voucher)
}

const updateVoucher = async (
  voucher: Voucher
): Promise<ApiResponse<Voucher>> => {
  return api.patch<Voucher>(`vouchers/${voucher.id}`, voucher)
}

const deleteVoucher = async (id: string): Promise<ApiResponse<Voucher>> => {
  return api.delete<Voucher>(`vouchers/${id}`)
}

export default function VoucherManagement() {
  const [page, setPage] = useState(1)
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const vouchersQuery = useQuery({
    queryKey: ["vouchers", page],
    queryFn: () => fetchVouchers(page),
  })

  const vouchers = vouchersQuery.data?.data?.items ?? []
  const totalCount = vouchersQuery.data?.data?.totalCount ?? 0
  const pageSize = vouchersQuery.data?.data?.pageSize ?? 10

  const selectedVoucherQuery = useQuery({
    queryKey: ["voucher", selectedVoucherId],
    queryFn: () =>
      selectedVoucherId ? fetchVoucherById(selectedVoucherId) : null,
    enabled: !!selectedVoucherId,
  })

  // Mutations
  const createVoucherMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] })
    },
  })

  const updateVoucherMutation = useMutation({
    mutationFn: updateVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] })
      queryClient.invalidateQueries({
        queryKey: ["voucher", selectedVoucherId],
      })
    },
  })

  const deleteVoucherMutation = useMutation({
    mutationFn: deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] })
      setSelectedVoucherId(null)
    },
  })

  // Event handlers
  const handleCreateVoucher = () => {
    const newVoucher = {
      code: "NEWVOUCHER",
      name: "New Voucher",
      description: "This is the new voucher",
      discountPercentage: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "ACTIVE",
      minOrderValue: 100,
      maxUse: 100,
      userAccountIds: [],
      type: "Discounts",
    }
    createVoucherMutation.mutate(newVoucher)
  }

  const handleUpdateVoucher = () => {
    if (selectedVoucherId && selectedVoucherQuery.data) {
      const updatedVoucher = {
        ...selectedVoucherQuery.data.data,
        discountPercentage: selectedVoucherQuery.data.data.discountPercentage + 5,
        usageLimit: selectedVoucherQuery.data.data.maxUse + 50,
      }
      updateVoucherMutation.mutate(updatedVoucher)
    }
  }

  const handleDeleteVoucher = () => {
    if (selectedVoucherId) {
      deleteVoucherMutation.mutate(selectedVoucherId)
    }
  }

  if (vouchersQuery.isLoading) return <LoadingPage />
  if (vouchersQuery.isError) return <div>Error loading vouchers</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voucher Management</h1>

      {/* Voucher List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Vouchers</h2>
        {vouchers.length === 0 ? (
          <p>No vouchers found.</p>
        ) : (
          <ul className="space-y-2">
            {vouchers.map((voucher) => (
              <li
                key={voucher.id}
                className={`cursor-pointer ${
                  selectedVoucherId === voucher.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedVoucherId(voucher.id)}
              >
                {voucher.code} - {voucher.discountPercentage}% off (Max ${voucher.discountPercentage})
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
            disabled={vouchers.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Voucher Details */}
      {selectedVoucherId && selectedVoucherQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Voucher Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>ID:</strong> {selectedVoucherQuery.data.data.id}</p>
            <p><strong>Code:</strong> {selectedVoucherQuery.data.data.code}</p>
            <p><strong>Discount Percentage:</strong> {selectedVoucherQuery.data.data.discountPercentage}%</p>
            <p><strong>Start Date:</strong> {new Date(selectedVoucherQuery.data.data.startDate).toLocaleString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedVoucherQuery.data.data.endDate).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedVoucherQuery.data.data.status}</p>
            <p><strong>Created Date:</strong> {new Date(selectedVoucherQuery.data.data.createdDate).toLocaleString()}</p>
            <p><strong>Updated Date:</strong> {new Date(selectedVoucherQuery.data.data.updatedDate).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateVoucher}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Voucher
        </button>
        <button
          onClick={handleUpdateVoucher}
          disabled={!selectedVoucherId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Voucher
        </button>
        <button
          onClick={handleDeleteVoucher}
          disabled={!selectedVoucherId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Voucher
        </button>
      </div>
    </div>
  )
}