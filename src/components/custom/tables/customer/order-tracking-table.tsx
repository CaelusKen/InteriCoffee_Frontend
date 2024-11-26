"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Search } from "lucide-react"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { Account, Order } from "@/types/frontend/entities"
import { api } from "@/service/api"
import { useAccessToken } from "@/hooks/use-access-token"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { mapBackendToFrontend } from "@/lib/entity-handling/handler"

const fetchAccount = async (email: string): Promise<ApiResponse<Account>> => {
  const response = await api.get(`accounts/${email}/info`)
  return {
    ...response,
    data: mapBackendToFrontend<Account>(response.data, 'account')
  }
}

const fetchOrders = async (): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return await api.getPaginated<Order>('orders', undefined)
}

interface OrderTableProps {
  email: string
}

export default function OrderTrackingTable({ email }: OrderTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const accessToken = useAccessToken()

  const accountQuery = useQuery({
    queryKey: ['account', email],
    queryFn: () => fetchAccount(email),
    enabled: !!email
  })

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders()
  })

  const account = accountQuery.data?.data

  const orders = ordersQuery.data?.data?.items ?? []

  const accountOrders = orders
    .filter((order) => order.accountId === account?.id)
    .sort((a, b) => b.updatedDate.getTime() - a.updatedDate.getTime())
    .slice(0, 5)

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500"
      case "Shipped":
        return "bg-blue-500"
      case "Delivered":
        return "bg-green-500"
      case "Cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-2">
      <div className="mb-4">
        <Label htmlFor="search" className="sr-only">
          Search orders
        </Label>
        <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by order ID or customer name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
                View all orders
            </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Ordered Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountOrders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                <TableCell>{order.totalAmount.toLocaleString('vi-VN', {style:'currency', currency:'VND'})}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getStatusColor(order.status)} text-white`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Package className="mr-2 h-4 w-4" />
                    Track
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}