"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { useAccessToken } from "@/hooks/use-access-token"
import { api } from "@/service/api"
import { Order, Product } from "@/types/frontend/entities"
import { mapBackendToFrontend } from "@/lib/entity-handling/handler"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Package, MapPin, CreditCard, ShoppingCart } from 'lucide-react'
import { OrderDeliveryStatus } from "@/components/order-delivery-status"

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
  return api.update<Order>("orders", id, { status }, accessToken)
}

interface OrderTicketProps {
  id: string
}

export default function OrderTicket({ id }: OrderTicketProps) {
  const accessToken = useAccessToken()

  const { data: orderData, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id, accessToken ?? ""),
    enabled: !!id && !!accessToken,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: Order["status"]) =>
      updateOrderStatus(id, newStatus, accessToken ?? ""),
    onSuccess: () => {
      refetch()
    },
  })

  const order = orderData?.data

  if (!order) return null

  const getStatusColor = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
      PENDING: "bg-yellow-500",
      SHIPPED: "bg-blue-500",
      COMPLETED: "bg-green-500",
      CANCELLED: "bg-red-500",
    }
    return colors[status] || "bg-gray-500"
  }

  const handleConfirmReceived = () => {
    updateStatusMutation.mutate("COMPLETED")
  }

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl">Order Ticket</CardTitle>
          <Badge variant="secondary" className="text-lg">#{order.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Order Status
                </p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Total Amount
                </p>
                <p className="text-2xl font-bold dark:text-white flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  {order.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
            <Separator className="border-dashed dark:border-gray-600" />
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400 flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Shipping Address
              </p>
              <p className="font-medium dark:text-white">{order.shippingAddress}</p>
            </div>
          </div>
          <OrderDeliveryStatus
            status={order.status}
            onConfirmReceived={handleConfirmReceived}
          />
        </div>
        <Separator className="border-dashed dark:border-gray-600" />
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.orderProducts.map((orderProduct) => (
              <OrderProductItem
                key={orderProduct.id}
                orderProduct={orderProduct}
                accessToken={accessToken ?? ""}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted dark:bg-gray-700 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="text-sm text-muted-foreground dark:text-gray-300">
          Thank you for your order!
        </p>
      </CardFooter>
    </Card>
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
    <Card>
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  )
}