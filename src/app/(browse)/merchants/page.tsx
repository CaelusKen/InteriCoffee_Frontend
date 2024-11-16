'use client'

import React from 'react'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Merchant } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import MerchantList from '@/components/custom/sections/body/browse-merchants/merchants/browse-merchants'

const fetchMerchants = async({pageNo = 1, pageSize = 10}) : Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
    return api.getPaginated('merchants', { pageNo, pageSize })
}

export default function MerchantsPage() {
    const pageNo = 1;
    const pageSize = 10;

    const merchantQuery = useQuery({
        queryKey: ['merchants'],
        queryFn: () => fetchMerchants({ pageNo, pageSize })
    })

    const merchants = merchantQuery.data?.data.items ?? []

    return (
        <div className="w-full py-8 px-8">
            <h1 className="text-3xl font-bold mb-6">Merchants</h1>
            <MerchantList merchants={merchants} />
        </div>
    )
}
