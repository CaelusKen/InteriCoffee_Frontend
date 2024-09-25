'use client'

import React, { useState, useMemo } from 'react'
import FilterButton from './filter-button'
import { Button } from '@/components/ui/button'
import { Undo } from 'lucide-react'
import { motion } from 'framer-motion'

const StyleDataList = [
  { value: "modern", label: "Modern" },
  { value: "vintage", label: "Vintage" },
  { value: "minimalist", label: "Minimalist" }
]

const ColorDataList = [
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" }
]

const MerchantDataList = [
  { value: "merchantA", label: "Merchant A" },
  { value: "merchantB", label: "Merchant B" },
  { value: "merchantC", label: "Merchant C" }
]

const FilterHeader = () => {
  const [filters, setFilters] = useState({
    Style: [],
    Color: [],
    Merchant: []
  });

  const handleSelectionChange = (type: string, values: string[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: values
    }));
  };

  const resetFilters = () => {
    setFilters({
      Style: [],
      Color: [],
      Merchant: []
    });
  };

  const totalFiltersApplied = useMemo(() => {
    return Object.values(filters).flat().length;
  }, [filters]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85 }}
      className='flex flex-col sm:flex-row items-center justify-between px-4 sm:px-10 py-4 bg-neutral-200 space-y-4 sm:space-y-0'
    >
      <ul className='flex flex-wrap items-center gap-4'>
        <li>
          <FilterButton 
            dataList={StyleDataList}
            typeOfData='Style'
            selectedValues={filters.Style}
            onSelectionChange={handleSelectionChange}
          />
        </li>
        <li>
          <FilterButton 
            dataList={ColorDataList}
            typeOfData='Color'
            selectedValues={filters.Color}
            onSelectionChange={handleSelectionChange}
          />
        </li>
        <li>
          <FilterButton 
            dataList={MerchantDataList}
            typeOfData='Merchant'
            selectedValues={filters.Merchant}
            onSelectionChange={handleSelectionChange}
          />
        </li>
      </ul>
      <ul className='flex items-center gap-4'>
        <li>
          <Button variant={'outline'} className='bg-white w-10 h-10'>
            {totalFiltersApplied}
          </Button>
        </li>
        <li>
          <Button 
            variant={'outline'} 
            className='bg-white hover:bg-primary-500 hover:text-white'
            onClick={resetFilters}
          >
            <span className='flex items-center gap-3'>
              <p>Reset Filter</p>
              <Undo size={20} />
            </span>
          </Button>
        </li>
      </ul>
    </motion.header>
  )
}

export default FilterHeader