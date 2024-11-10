"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Product } from "@/types/frontend/entities"
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

const fetchProducts = async (
    page = 1,
    pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return api.getPaginated<Product>("products", { page, pageSize })
}

export default function MerchantProductsTable() {
    const [page, setPage] = useState(1)

    const router = useRouter();

    const productsQuery = useQuery({
        queryKey: ["products", page],
        queryFn: () => fetchProducts(page),
    })

    const products = productsQuery.data?.data?.items ?? []
    const totalCount = productsQuery.data?.data?.totalCount ?? 0
    const pageSize = productsQuery.data?.data?.pageSize ?? 10 

    if (productsQuery.isLoading) return <LoadingPage />
    if (productsQuery.isError) return <div>Error loading products</div>

    return(
        <section>
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>

            {/* Product List */}
            {
                products.length === 0 ? (
                    <p>No Products found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Selling Price</TableHead>
                                <TableHead>Quantity In Stock</TableHead>
                                <TableHead>Dimensions</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.sellingPrice}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>{product.dimensions}</TableCell>
                                        <TableCell>{product.createdDate.toISOString()}</TableCell>
                                        <TableCell className="flex justify-end items-center">
                                            <Button onClick={() => router.push(`/merchant/products/${product.id}`)}>Details</Button>
                                            <Button>Edit</Button>
                                            <Button>Remove</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                )
            }
        </section>
    )
}