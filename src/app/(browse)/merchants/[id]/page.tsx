'use client'

import MerchantProfile from '@/components/custom/sections/body/browse-merchants/merchants/merchant-details'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Merchant } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import React from 'react'


export default function MerchantDetailsPage({ params }: { params: { id: string } }) {
    return (
        <MerchantProfile id={params.id}/>
    )
}
