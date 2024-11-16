'use client'

import MerchantProfile from '@/components/custom/sections/body/browse-merchants/merchants/merchant-details'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Merchant } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const fetchMerchant = async(id: string) : Promise<ApiResponse<Merchant>> => {
    return api.getById('merchants', id)
}

const fetchConsultants = async({pageNo = 1, pageSize = 10}): Promise<ApiResponse<PaginatedResponse<Account>>> => {
    return api.getPaginated('accounts', { pageNo, pageSize})
}

export default function MerchantDetailsPage({ params }: { params: { id: string } }) {
    const pageNo = 1;
    const pageSize = 10;
    
    const merchantQuery = useQuery({
        queryKey: ['merchant', params.id],
        queryFn: () => fetchMerchant(params.id),
        enabled: !!params.id
    })

    const accountQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => fetchConsultants({ pageNo, pageSize }),
    })

    const merchantInfo = merchantQuery.data?.data
    
    const accountList = accountQuery.data?.data.items ?? []

    const consultantAccounts = accountList.filter((account) => account.merchantId.match(params.id))
  
    const consultants = consultantAccounts.map((account) => ({
        id: account.id,
        name: account.userName,
    }))

    return (
        <MerchantProfile merchant={{
            id: merchantInfo?.id || '',
            name: merchantInfo?.name || '',
            description: merchantInfo?.description || '',
            consultants: consultants
        }}/>
    )
}
