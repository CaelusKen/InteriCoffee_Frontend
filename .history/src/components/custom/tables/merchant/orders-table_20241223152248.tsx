'use client'

import { Badge } from '@/components/ui/badge'
import { mapBackendToFrontend, mapBackendListToFrontend } from '@/lib/entity-handling/handler'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Order } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
  } from "@tanstack/react-table"
import { useSession } from 'next-auth/react'
import React from 'react'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchMerchantOrders = async(merchantId: string) : Promise<ApiResponse<PaginatedResponse<any>>> => {
  return api.get<any>(`orders/merchant/${merchantId}`)
}

const MerchantsOrderTable = () => {
    const { data: session } = useSession();

    // Account Query
    const accountQuery = useQuery({
        queryKey: ['accountByEmail', session?.user.email],
        queryFn: () => fetchAccountByEmail(session?.user.email ?? ''),
        enabled: !!session?.user.email,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    // Get merchant ID from account data
    const merchantId = accountQuery.data?.data ? 
        mapBackendToFrontend<Account>(accountQuery.data.data, 'account').merchantId : 
        null;

    // Orders Query - depends on merchantId
    const ordersQuery = useQuery({
        queryKey: ['merchantOrders', merchantId],
        queryFn: () => fetchMerchantOrders(merchantId!),
        enabled: !!merchantId,
        staleTime: 1000 * 60 * 5,
        select: (data) => mapBackendListToFrontend<Order>(data.data.items, 'order').items
    })

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

    // Setup Order Table
    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'id',
            header: 'Order Id',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({row}) => `${row.original.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
        },
        {
            accessorKey: 'orderDate',
            header: 'Order Date',
            cell: ({row}) => new Date(row.original.orderDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        },
        {
            accessorKey:'status',
            header: 'Status',
            cell: ({row}) => {
                return(
                    <Badge variant="secondary" className={`${getStatusColor(row.original.status)} text-white`}>
                        {row.original.status}
                    </Badge>
                )
            },
        }
    ]

    if (accountQuery.isLoading || ordersQuery.isLoading) {
        return <div>Loading...</div>
    }

    if (!accountQuery.data?.data ||!ordersQuery.data) {
        return <div>Error fetching data</div>
    }

    return (
        <div>MerchantsOrderTable</div>
    )
}

export default MerchantsOrderTable