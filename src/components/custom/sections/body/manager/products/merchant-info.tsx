'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Label } from "@/components/ui/label"
import { api } from "@/service/api"
import { Merchant } from "@/types/frontend/entities"
import { ApiResponse } from '@/types/api'

const fetchMerchantById = async(id: string): Promise<ApiResponse<Merchant>> => {
  return api.getById<Merchant>(`merchants`, id)
}

interface MerchantInfoProps {
  merchantId: string
}

export function MerchantInfo({ merchantId }: MerchantInfoProps) {
  const accountQuery = useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () => fetchMerchantById(merchantId),
    enabled: !!merchantId
  })

  if (accountQuery.isLoading) {
    return <div>Loading merchant info...</div>
  }

  if (accountQuery.isError) {
    return <div>Error loading merchant info. Please try again.</div>
  }

  const account = accountQuery.data?.data

  return (
    <div>
      <Label className="text-sm font-semibold">Created By</Label>
      <p className="mt-1">{account?.name}</p>
    </div>
  )
}