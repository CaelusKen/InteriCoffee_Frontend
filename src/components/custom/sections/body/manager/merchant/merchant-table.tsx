'use client'

import { useAccessToken } from '@/hooks/use-access-token'
import { mapBackendListToFrontend } from '@/lib/entity-handling/handler'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Merchant } from '@/types/frontend/entities'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { DataTable } from '@/components/ui/data-table'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const fetchMerchants = async() : Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
    return api.getPaginated('merchants', undefined)
}

const UnverifiedMerchantTable = () => {
    const accessToken = useAccessToken()

    const router = useRouter()

    const merchantQuery = useQuery({
        queryKey: ['merchants'],
        queryFn: () => fetchMerchants()
    })

    const merchants = merchantQuery.data?.data.items ?? []

    const unverifiedMerchants = merchants.filter((merchant) => merchant.status === "UNVERIFIED")

    const verifyMerchant = async (merchantId: string) => {
        await api.patch<Merchant>(`merchants/${merchantId}`, { status: "ACTIVE" }, undefined, accessToken ?? '')
            .then((response) => {
                console.log(response)
            }).catch((err) => {
                console.error(err)
            })
    }    

    // Create data table
    const columns: ColumnDef<Merchant>[] = [
        { 
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Merchant Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                )
              },
          
            accessorKey: 'name',

        },
        {
            header: 'Document',
            accessorKey: 'policyDocument',
            cell: ({ row }) => (
                <Button variant={'link'} onClick={ () => router.push(row.original.policyDocument ?? '')}>View</Button>
            )
        },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Merchant Website',
            accessorKey: 'website',
            cell: ({ row }) => (
                <Link className='underline' href={row.original.website}>{row.original.website}</Link>
            )
        },
        { 
            header: 'Actions', 
            accessorKey: 'id', 
            cell: ({ row }) => (
                <Button onClick={() => verifyMerchant(row.original.id)}>Verify</Button>
            ) 
        },

    ]

  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Merchant Management</h1>
        {/* Table with shadcn ui and  */}
        <DataTable columns={columns} data={unverifiedMerchants}/>
    </div>
  )
}

export default UnverifiedMerchantTable