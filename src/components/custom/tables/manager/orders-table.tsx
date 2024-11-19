"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Account, Order } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Currency } from "lucide-react"
import { useAccessToken } from "@/hooks/use-access-token"

const fetchOrders = async (
    page = 1,
    pageSize = 10,
    accessToken = ''
): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    return api.getPaginated<Order>("orders", { page, pageSize }, accessToken)
}

const fetchAccountById = async(id: string, accessToken: string) : Promise<ApiResponse<Account>> => {
    return api.getById('accounts', id, accessToken)
}

export default function ManagerOrdersTable() {
    const [page, setPage] = useState(1)

    const router = useRouter();

    const accessToken = useAccessToken();

    const ordersQuery = useQuery({
        queryKey: ["orders", page],
        queryFn: () => fetchOrders(page, 10, accessToken ?? ''),
    });

    const orders = ordersQuery.data?.data.items ?? []
    const totalCount = ordersQuery.data?.data?.totalCount ?? 0
    const pageSize = ordersQuery.data?.data?.pageSize ?? 10

    if (ordersQuery.isLoading) return <LoadingPage />
    if (ordersQuery.isError) return <div>Error loading products</div>

    return(
        <section>
            <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

            {/* Orders List */}
            {
                orders.length === 0 ? (
                    <p>No Orders Found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No.</TableHead>
                                <TableHead>Order Date</TableHead>
                                <TableHead>Order Total</TableHead>
                                <TableHead>Shipping Address</TableHead>
                                <TableHead className="text-right">Order Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{order.orderDate.toDateString()}</TableCell>
                                    <TableCell>{order.totalAmount.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</TableCell>
                                    <TableCell>{order.shippingAddress}</TableCell>
                                    <TableCell className="text-right">
                                        {order.status}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            }
        </section>
    )
}