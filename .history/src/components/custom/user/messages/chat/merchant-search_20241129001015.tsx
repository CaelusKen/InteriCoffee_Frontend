'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from '@/service/api'
import { Merchant } from '@/types/frontend/entities'
import { ApiResponse } from '@/types/api'

interface MerchantSearchProps {
  onMerchantSelect: (merchant: Merchant) => void;
}

export function MerchantSearch({ onMerchantSelect }: MerchantSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const fetchMerchants = async (): Promise<ApiResponse<Merchant[]>> => {
    return api.get<Merchant[]>(`merchants`)
  }

  const { data: merchantsData, refetch } = useQuery({
    queryKey: ['merchants', searchTerm],
    queryFn: fetchMerchants,
    enabled: false,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch()
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
          <Button type="submit">Search</Button>
        </form>
        <div className="space-y-2">
          {merchantsData?.data?.map((merchant) => (
            <Button
              key={merchant.id}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => onMerchantSelect(merchant)}
            >
              {merchant.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}