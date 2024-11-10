"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Style } from "@/types/frontend/entities"
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

const fetchStyles = async (
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<Style>>> => {
    return api.getPaginated<Style>("styles", { page, pageSize })
}

export default function MerchantStylesTable() {
    const [page, setPage] = useState(1)

    const stylesQuery = useQuery({
        queryKey: ["styles", page],
        queryFn: () => fetchStyles(page),
    })

    const styles = stylesQuery.data?.data?.items ?? [];
    const totalCount = stylesQuery.data?.data?.totalCount ?? 0
    const pageSize = stylesQuery.data?.data?.pageSize ?? 10

    if (stylesQuery.isLoading) return <LoadingPage />
    if (stylesQuery.isError) return <div>Error loading styles</div>

    return(
        <section>
            <h1 className="text-2xl font-bold mb-4">Styles Management</h1>

            {/* Styles List */}
            {
                styles.length === 0 ? (
                    <p>No Styles found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No.</TableHead>
                                <TableHead>Style Name</TableHead>
                                <TableHead>Style Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {styles.map((style,index) => (
                                <TableRow key={index}>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{style.name}</TableCell>
                                    <TableCell>{style.description}</TableCell>
                                    <TableCell className="flex justify-end items-center">
                                        <Button>Edit</Button>
                                        <Button>Remove</Button>
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