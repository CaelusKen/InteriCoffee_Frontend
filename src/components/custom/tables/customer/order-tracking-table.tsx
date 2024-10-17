"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Search } from "lucide-react"

interface Order {
  id: string
  customer: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  estimatedDelivery: string
}

const recentOrders: Order[] = [
  { id: "ORD001", customer: "Alice Johnson", status: "Processing", estimatedDelivery: "2023-05-25" },
  { id: "ORD002", customer: "Bob Smith", status: "Shipped", estimatedDelivery: "2023-05-23" },
  { id: "ORD003", customer: "Charlie Brown", status: "Delivered", estimatedDelivery: "2023-05-20" },
  { id: "ORD004", customer: "Diana Prince", status: "Processing", estimatedDelivery: "2023-05-26" },
  { id: "ORD005", customer: "Ethan Hunt", status: "Cancelled", estimatedDelivery: "2023-05-22" },
]

export default function OrderTrackingTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = recentOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <TableHead>Merchant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getStatusColor(order.status)} text-white`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.estimatedDelivery}</TableCell>
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