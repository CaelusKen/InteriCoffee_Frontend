'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from '@/service/api'
import { Merchant } from '@/types/frontend/entities'
import { ApiResponse, PaginatedResponse } from '@/types/api'

interface MerchantSearchProps {
  onMerchantSelect: (merchant: Merchant) => void;
  isCreatingSession: boolean;
}

export function MerchantSearch({ onMerchantSelect, isCreatingSession }: MerchantSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const fetchMerchants = async (): Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
    return api.getPaginated<Merchant>(`merchants?search=${searchTerm}`)
  }

  const { data: merchantsData, refetch, isLoading } = useQuery({
    queryKey: ['merchants', searchTerm],
    queryFn: fetchMerchants,
    enabled: false,
  })

  const merchants = merchantsData?.data.items ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for merchants with term:', searchTerm)
    refetch()
  }

  const handleMerchantClick = (merchant: Merchant) => {
    console.log('Merchant selected:', merchant)
    onMerchantSelect(merchant)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Merchants</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search merchants..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
        <div className="space-y-2">
          {merchants.map((merchant) => (
            <Button
              key={merchant.id}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => handleMerchantClick(merchant)}
              disabled={isCreatingSession}
            >
              {merchant.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}