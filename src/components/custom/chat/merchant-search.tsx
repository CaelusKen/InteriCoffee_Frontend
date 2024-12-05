'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Merchant } from '@/types/frontend/entities'
import { api } from '@/service/api'

interface MerchantSearchProps {
  onSelectMerchant: (merchant: Merchant) => void
}

const fetchMerchants = async(keyword: string): Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
  return api.getPaginated<Merchant>('merchants', {keyword: keyword})
}

export function MerchantSearch({ onSelectMerchant }: MerchantSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchMerchants(searchQuery)
      setMerchants(response.data.items)
    } catch (error) {
      console.error('Error fetching merchants:', error)
      setError('Failed to fetch merchants. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4">
        <h2 className="font-semibold mb-2">Search for Merchants</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search merchants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      <ScrollArea className="flex-1">
        {error && <p className="text-red-500 p-4">{error}</p>}
        <div className="p-4 space-y-4">
          {merchants.map((merchant) => (
            <div key={merchant.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={merchant.logoUrl} />
                  <AvatarFallback>{merchant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{merchant.name}</div>
                  <div className="text-sm text-muted-foreground">{merchant.email}</div>
                </div>
              </div>
              <Button onClick={() => onSelectMerchant(merchant)}>Chat</Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}