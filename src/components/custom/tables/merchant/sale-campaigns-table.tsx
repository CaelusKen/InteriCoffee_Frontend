"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { SaleCampaign } from "@/types/frontend/entities"
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
import { useAccessToken } from "@/hooks/use-access-token"

const fetchProducts = async (accessToken: string): Promise<ApiResponse<PaginatedResponse<SaleCampaign>>> => {
    return api.getPaginated<SaleCampaign>("sale-campaigns", undefined, accessToken)
}

export default function MerchantSaleCampaignsTable() {
    const [page, setPage] = useState(1)

    const router = useRouter();

    const accessToken = useAccessToken()

    const campaignsQuery = useQuery({
        queryKey: ["sale-campaigns", page],
        queryFn: () => fetchProducts(accessToken ?? ''),
    })

    const saleCampaigns = campaignsQuery.data?.data?.items ?? []
    const totalCount = campaignsQuery.data?.data?.totalCount ?? 0
    const pageSize = campaignsQuery.data?.data?.pageSize ?? 10 

    if (campaignsQuery.isLoading) return <LoadingPage />
    if (campaignsQuery.isError) return <div>Error loading sale campaigns</div>

    return(
        <section>
            <h1 className="text-2xl font-bold mb-4">Sale Campaigns Management</h1>

            {/* Sale Campaigns List */}
            {
                saleCampaigns.length === 0 ? (
                    <p>No sale campaigns found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Start from</TableHead>
                                <TableHead>End at</TableHead>
                                <TableHead>Apply for Products</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {saleCampaigns.map((saleCampaign, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index}</TableCell>
                                        <TableCell>{saleCampaign.name}</TableCell>
                                        <TableCell>{saleCampaign.description}</TableCell>
                                        <TableCell>{saleCampaign.startDate.toDateString()}</TableCell>
                                        <TableCell>{saleCampaign.endDate.toDateString()}</TableCell>
                                        <TableCell>
                                            {Array.isArray(saleCampaign.campaignProductIds) && saleCampaign.campaignProductIds.length > 0 ? (
                                                <div className="max-h-20 overflow-y-auto">
                                                    {saleCampaign.campaignProductIds.join(", ")}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">No products</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="flex justify-end items-center">
                                            <Button>Details</Button>
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