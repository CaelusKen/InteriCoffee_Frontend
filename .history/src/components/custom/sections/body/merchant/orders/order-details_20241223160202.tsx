"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/service/api"
import { Order, Product } from "@/types/frontend/entities"
import { mapBackendToFrontend } from "@/lib/entity-handling/handler"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Package, MapPin, CreditCard, ShoppingCart, Printer } from 'lucide-react'
import { PackagingStatus } from "./merchant-order-status"

const fetchOrderById = async (id: string) => {
  return api.getById<Order>(`orders`, id)
}

const fetchProductById = async (id: string): Promise<Product> => {
  const product = await api
    .get<Product>(`products/${id}`)
    .then((res) => mapBackendToFrontend<Product>(res.data, "product"))
  return product
}

const updatePackagingStatus = async (id: string, status: string) => {
  return api.patch<Order>(`orders/${id}`, { status: status })
}

interface PackagingDetailsProps {
  id: string
}

export default function MerchantOrderDetails({ id }: PackagingDetailsProps) {
  const { data: orderData, refetch } = useQuery({
    queryKey: ["packaging-order", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => updatePackagingStatus(id, newStatus),
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

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate("SHIPPED")
  }

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl">Packaging Details</CardTitle>
          <div className="flex gap-4 items-center">
            <Badge variant="secondary" className="text-lg">
              #{order.id?.replace(/\D/g, "").slice(0, 8)}
            </Badge>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Label
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Packaging Status
                </p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Total Items
                </p>
                <p className="text-2xl font-bold dark:text-white flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  {order.orderProducts.reduce((acc, item) => acc + item.quantity, 0)}
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
          <PackagingStatus
            status={order.status}
            onUpdateStatus={handleStatusUpdate}
          />
        </div>
        <Separator className="border-dashed dark:border-gray-600" />
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Items to Package
          </h2>
          <div className="space-y-4">
            {order.orderProducts.map((orderProduct) => (
              <PackagingProductItem
                key={orderProduct.id}
                orderProduct={orderProduct}
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
          Order placed on {new Date(order.orderDate).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  )
}

function PackagingProductItem({
  orderProduct,
}: {
  orderProduct: Order["orderProducts"][0]
}) {
  const { data: productData } = useQuery({
    queryKey: ["packaging-product", orderProduct.id],
    queryFn: () => fetchProductById(orderProduct.id),
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
          </div>
          <div className="text-right">
            <Badge variant="outline">
                Quantity: {orderProduct.quantity} {orderProduct.quantity === 1? 'unit' : 'units'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}