'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Order } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"

// API functions
const fetchOrders = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return api.getPaginated<Order>("orders", { page, pageSize })
}

const fetchOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  return api.getById<Order>("orders", id)
}

const createOrder = async (
  order: Omit<Order, "id" | "orderDate" | "updatedDate">
): Promise<ApiResponse<Order>> => {
  return api.post<Order>("orders", order)
}

const updateOrder = async (
  order: Order
): Promise<ApiResponse<Order>> => {
  return api.patch<Order>(`orders/${order.id}`, order)
}

const deleteOrder = async (id: string): Promise<ApiResponse<Order>> => {
  return api.delete<Order>(`orders/${id}`)
}

export default function OrderManagement() {
  const [page, setPage] = useState(1)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const ordersQuery = useQuery({
    queryKey: ["orders", page],
    queryFn: () => fetchOrders(page),
  })

  const orders = ordersQuery.data?.data?.items ?? []
  const totalCount = ordersQuery.data?.data?.totalCount ?? 0
  const pageSize = ordersQuery.data?.data?.pageSize ?? 10

  const selectedOrderQuery = useQuery({
    queryKey: ["order", selectedOrderId],
    queryFn: () =>
      selectedOrderId ? fetchOrderById(selectedOrderId) : null,
    enabled: !!selectedOrderId,
  })

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({
        queryKey: ["order", selectedOrderId],
      })
    },
  })

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      setSelectedOrderId(null)
    },
  })

  // Event handlers
  const handleCreateOrder = () => {
    const newOrder = {
      status: "PENDING",
      vat: 10,
      feeAmount: 5,
      totalAmount: 100,
      shippingAddress: "123 New St, City, Country",
      orderProducts: [],
      systemIncome: 10,
      voucherId: "",
      accountId: "account123",
    }
    createOrderMutation.mutate(newOrder)
  }

  const handleUpdateOrder = () => {
    if (selectedOrderId && selectedOrderQuery.data) {
      const updatedOrder = {
        ...selectedOrderQuery.data.data,
        status: "SHIPPED",
      }
      updateOrderMutation.mutate(updatedOrder)
    }
  }

  const handleDeleteOrder = () => {
    if (selectedOrderId) {
      deleteOrderMutation.mutate(selectedOrderId)
    }
  }

  if (ordersQuery.isLoading) return <LoadingPage />
  if (ordersQuery.isError) return <div>Error loading orders</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* Order List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li
                key={order.id}
                className={`cursor-pointer ${
                  selectedOrderId === order.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                Order {order.id} - {order.status} (${order.totalAmount})
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
            disabled={orders.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Order Details */}
      {selectedOrderId && selectedOrderQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Order Details</h2>
          <div className="bg-black p-4 rounded-lg">
            <p><strong>Order ID:</strong> {selectedOrderQuery.data.data.id}</p>
            <p><strong>Status:</strong> {selectedOrderQuery.data.data.status}</p>
            <p><strong>Total Amount:</strong> ${selectedOrderQuery.data.data.totalAmount}</p>
            <p><strong>VAT:</strong> ${selectedOrderQuery.data.data.vat}</p>
            <p><strong>Fee Amount:</strong> ${selectedOrderQuery.data.data.feeAmount}</p>
            <p><strong>Shipping Address:</strong> {selectedOrderQuery.data.data.shippingAddress}</p>
            <p><strong>System Income:</strong> ${selectedOrderQuery.data.data.systemIncome}</p>
            <p><strong>Voucher ID:</strong> {selectedOrderQuery.data.data.voucherId || 'N/A'}</p>
            <p><strong>Account ID:</strong> {selectedOrderQuery.data.data.accountId}</p>
            <p><strong>Order Date:</strong> {selectedOrderQuery.data.data.orderDate.toLocaleString()}</p>
            <p><strong>Updated Date:</strong> {selectedOrderQuery.data.data.updatedDate.toLocaleString()}</p>
            <p><strong>Products:</strong> {selectedOrderQuery.data.data.orderProducts.length}</p>
          </div>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateOrder}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Order
        </button>
        <button
          onClick={handleUpdateOrder}
          disabled={!selectedOrderId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Order
        </button>
        <button
          onClick={handleDeleteOrder}
          disabled={!selectedOrderId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Order
        </button>
      </div>
    </div>
  )
}