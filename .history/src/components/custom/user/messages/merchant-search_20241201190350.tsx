'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Merchant } from '@/types/frontend/entities'
import { searchMerchants } from '@/utils/merchant-search'

interface MerchantSearchProps {
  onSelect: (merchant: Merchant) => void
}

export function MerchantSearch({ onSelect }: MerchantSearchProps) {
  const [query, setQuery] = useState('')
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetchMerchants()
      } else {
        setMerchants([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const fetchMerchants = async () => {
    setIsLoading(true)
    try {
      const result = await searchMerchants(query)
      setMerchants(result.items)
    } catch (error) {
        console.error('Error searching merchants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Search merchants..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {merchants?.map((merchant) => (
            <li key={merchant.id}>
              <Button
                variant="ghost"
                className="w-full text-left"
                onClick={() => onSelect(merchant)}
              >
                {merchant.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}