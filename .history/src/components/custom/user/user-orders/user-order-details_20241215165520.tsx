"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccessToken } from "@/hooks/use-access-token"
import { api } from "@/service/api"
import { Order, Product } from "@/types/frontend/entities"
import { mapBackendToFrontend } from "@/lib/entity-handling/handler"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft } from 'lucide-react'
import { OrderDeliveryStatus } from "./user-order-delivery-status"

const fetchOrderById = async (id: string, accessToken: string) => {
  return api.getById<Order>("orders", id, accessToken)
}

const fetchProductById = async (
  id: string,
  accessToken: string
): Promise<Product> => {
  const product = await api
    .getById<Product>("products", id, accessToken)
    .then((res) => {
      return mapBackendToFrontend<Product>(res.data, "product")
    })
  return product
}

const updateOrderStatus = async (id: string, status: Order["status"], accessToken: string) => {
  return api.patch<Order>(`orders/${id}`, { status:  status }, undefined, accessToken)
}

interface OrderTicketProps {
  id: string
}

import { Order } from "@/types/frontend/entities"

// ... previous code remains the same

function OrderTicket({ id }: OrderTicketProps) {
  // ... previous code remains the same

  const getStatusColor = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
      PENDING: "bg-yellow-500",
      SHIPPED: "bg-blue-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  // ... previous code remains the same

  return (
    // ... previous code remains the same
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-6 flex-1">
          // ... previous code remains the same
          <div>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Order Status
            </p>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
          // ... previous code remains the same
        </div>
        // ... previous code remains the same
      </div>
      // ... previous code remains the same
    </div>
  )
}


function OrderProductItem({
  orderProduct,
  accessToken,
}: {
  orderProduct: Order["orderProducts"][0]
  accessToken: string
}) {
  const { data: productData } = useQuery({
    queryKey: ["product", orderProduct.id],
    queryFn: () => fetchProductById(orderProduct.id, accessToken),
  })

  const product = productData

  if (!product) return null

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0 h-20 w-20">
        <img
          src={product.images.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium dark:text-white">{product.name}</h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          {orderProduct.quantity} x{" "}
          {orderProduct.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium dark:text-white">
          {(orderProduct.quantity * orderProduct.price).toLocaleString(
            "vi-VN",
            { style: "currency", currency: "VND" }
          )}
        </p>
      </div>
    </div>
  )
}