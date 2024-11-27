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
import { ArrowLeft, ArrowRight, Currency } from "lucide-react"
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

    const orders = ordersQuery.data?.data.items.sort((a, b) => b.updatedDate.getTime() - a.updatedDate.getTime()) ?? []

    //Pagination
    const handlePreviousPage = () => setPage(page - 1);
    const handleNextPage = () => setPage(page + 1);
    const handleSetPage = (newPage: number) => setPage(newPage);
    const slicedOrders = orders.slice((page - 1) * 10, page * 10);


    if (ordersQuery.isLoading) return <LoadingPage />
    if (ordersQuery.isError) return <div>Error loading products</div>

    //Create a Data Table with shadcn for Orders


    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

            {/* Orders List */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Shipping Address</TableHead>
                        <TableHead>Order at</TableHead>
                        <TableHead>Updated at</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {slicedOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                                {order.totalAmount.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}
                            </TableCell>
                            <TableCell>{order.shippingAddress}</TableCell>
                            <TableCell>{order.orderDate.toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{order.updatedDate.toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                                <Button onClick={() => router.push(`/manager/orders/${order.id}`)}>
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-4 mt-4">
                <Button onClick={handlePreviousPage} disabled={page === 1}>
                    <ArrowLeft/> Previous
                </Button>
                <span>Page {page} of {Math.ceil(orders.length / 10)}</span>
                <Button onClick={handleNextPage} disabled={page === Math.ceil(orders.length / 10)}>
                    Next <ArrowRight />
                </Button>
            </div>
        </section>
    )
}