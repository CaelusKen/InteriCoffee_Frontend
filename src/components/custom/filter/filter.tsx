'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from 'lucide-react'

type FilterOption<T extends string | number | boolean> = {
  type: 'text' | 'select' | 'range' | 'checkbox';
  label: string;
  key: string;
  options?: T[];
  min?: number;
  max?: number;
  step?: number;
}

type FilterValues = Record<string, string | number | boolean | [number, number]>;

interface AbstractFilterComponentProps<T extends FilterValues> {
  filters: T;
  setFilters: React.Dispatch<React.SetStateAction<T>>;
  filterOptions: FilterOption<string | number | boolean>[];
}

export default function Filter<T extends FilterValues>({
  filters,
  setFilters,
  filterOptions
}: AbstractFilterComponentProps<T>) {
  const handleFilterChange = (key: string, value: string | number | boolean | [number, number]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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
                value={filters[option.key] as string}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          )}
          {option.type === 'select' && option.options && (
            <Select 
              value={filters[option.key] as string} 
              onValueChange={(value) => handleFilterChange(option.key, value)}
            >
              <SelectTrigger id={option.key}>
                <SelectValue placeholder={`Select ${option.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className='bg-white text-black'>
                {option.options.map((opt) => (
                  <SelectItem key={opt.toString()} value={opt.toString()}>{opt.toString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {option.type === 'range' && (
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                placeholder="Min"
                value={(filters[option.key] as [number, number])[0]}
                onChange={(e) => handleFilterChange(option.key, [Number(e.target.value), (filters[option.key] as [number, number])[1]])}
                className="w-24"
              />
              <Slider
                min={option.min || 0}
                max={option.max || 100}
                step={option.step || 1}
                value={filters[option.key] as [number, number]}
                onValueChange={(value) => handleFilterChange(option.key, [value[0], value[1] ?? value[0]])}
                className="w-full"
              />
              <Input
                type="number"
                placeholder="Max"
                value={(filters[option.key] as [number, number])[1]}
                onChange={(e) => handleFilterChange(option.key, [(filters[option.key] as [number, number])[0], Number(e.target.value)])}
                className="w-24"
              />
            </div>
          )}
          {option.type === 'checkbox' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={option.key}
                checked={filters[option.key] as boolean}
                onCheckedChange={(checked) => handleFilterChange(option.key, checked as boolean)}
              />
              <Label htmlFor={option.key}>{option.label}</Label>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}