"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Account } from "@/types/frontend/entities"
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

const fetchAccounts = async (
    page = 1,
    pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Account>>> => {
    return api.getPaginated<Account>("accounts", { page, pageSize })
}

export default function AccountsTable() {
    const [page, setPage] = useState(1)

    const accountsQuery = useQuery({
        queryKey: ["accounts", page],
        queryFn: () => fetchAccounts(page),
      })
    
    const accounts = accountsQuery.data?.data?.items ?? []
    const totalCount = accountsQuery.data?.data?.totalCount ?? 0
    const pageSize = accountsQuery.data?.data?.pageSize ?? 10

    if (accountsQuery.isLoading) return <LoadingPage />
    if (accountsQuery.isError) return <div>Error loading accounts</div>

    return(
        <section>
            <h1 className="text-2xl font-bold mb-4">Account Management</h1>

            {/* Account List */}
            {
                accounts.length === 0 ? (
                    <p>No accounts found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Avatar</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                {/* <TableHead>Phone</TableHead> */}
                                {/* <TableHead>Address</TableHead> */}
                                <TableHead>Status</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created Date</TableHead>
                                {/* <TableHead>Updated Date</TableHead> */}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        <img src={account.avatar} alt={account.userName} className="w-[40px] rounded-full h-full object-cover"/>
                                    </TableCell>
                                    <TableCell>{account.userName}</TableCell>
                                    <TableCell>{account.email}</TableCell>
                                    {/* <TableCell>{account.phoneNumber}</TableCell> */}
                                    {/* <TableCell>{account.address}</TableCell> */}
                                    <TableCell>{account.status}</TableCell>
                                    <TableCell>{account.role}</TableCell>
                                    <TableCell>{account.createdDate.toLocaleDateString()}</TableCell>
                                    {/* <TableCell>{account.updatedDate.toLocaleDateString()}</TableCell> */}
                                    {/* This will be a toggler for the status of the account */}
                                    <TableCell className="flex justify-end items-center">
                                        <Button>Unban</Button>
                                        <Button>Ban</Button>
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