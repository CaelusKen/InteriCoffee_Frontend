'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from 'lucide-react'

type FilterOption = {
  type: 'text' | 'select' | 'range' | 'checkbox'
  label: string
  key: string
  options?: string[]
  min?: number
  max?: number
  step?: number
}

type FilterValues = {
  search: string
  category: string
  priceRange: [number, number]
}

interface FilterComponentProps {
  filters: FilterValues
  setFilters: (key: string, value: string | number | boolean | [number, number]) => void
  filterOptions: FilterOption[]
}

export default function Filter({
  filters,
  setFilters,
  filterOptions
}: FilterComponentProps) {
  return (
    <div className="space-y-4">
      {filterOptions.map((option) => (
        <div key={option.key}>
          <Label htmlFor={option.key}>{option.label}</Label>
          {option.type === 'text' && (
            <div className="relative">
              <Input
                id={option.key}
                placeholder={`Search ${option.label.toLowerCase()}...`}
                value={filters[option.key as keyof FilterValues] as string}
                onChange={(e) => setFilters(option.key, e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          )}
          {option.type === 'select' && option.options && (
            <Select 
              value={filters[option.key as keyof FilterValues] as string} 
              onValueChange={(value) => setFilters(option.key, value)}
            >
              <SelectTrigger id={option.key}>
                <SelectValue placeholder={`Select ${option.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className='bg-white text-black'>
                {option.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {option.type === 'range' && (
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Min"
                value={(filters[option.key as keyof FilterValues] as [number, number])[0]}
                onChange={(e) => setFilters(option.key, [Number(e.target.value), (filters[option.key as keyof FilterValues] as [number, number])[1]])}
                className="w-24"
              />
              <Slider
                min={option.min || 0}
                max={option.max || 100}
                step={option.step || 1}
                value={filters[option.key as keyof FilterValues] as [number, number]}
                onValueChange={(value) => setFilters(option.key, value as [number, number])}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={(filters[option.key as keyof FilterValues] as [number, number])[1]}
                onChange={(e) => setFilters(option.key, [(filters[option.key as keyof FilterValues] as [number, number])[0], Number(e.target.value)])}
                className="w-24"
              />
            </div>
          )}
          {option.type === 'checkbox' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={option.key}
                checked={Boolean(filters[option.key as keyof FilterValues])}
                onCheckedChange={(checked) => setFilters(option.key, checked)}
              />
              <Label htmlFor={option.key}>{option.label}</Label>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}