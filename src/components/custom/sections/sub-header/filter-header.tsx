'use client'

import React from 'react'
import FilterButton from './filter-button'
import { Button } from '@/components/ui/button'
import { Undo } from 'lucide-react'
import { motion } from 'framer-motion'

const StyleDataList = [
  {
    value: "modern",
    label: "Modern"
  },
  {
    value: "vintage",
    label: "Vintage",
  },
  {
    value: "minimalist",
    label: "Minimalist",
  }
]

const ColorDataList = [
  {
    value: "red",
    label: "Red"
  },
  {
    value: "blue",
    label: "Blue",
  },
  {
    value: "green",
    label: "Green",
  }
]

const MerchantDataList = [
  {
    value: "merchantA",
    label: "Merchant A"
  },
  {
    value: "merchantB",
    label: "Merchant B",
  },
  {
    value: "merchantC",
    label: "Merchant C",
  }
]

const FilterHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85 }}
      className='flex items-center justify-between px-10 py-4 bg-neutral-200 '>
      <ul className='flex items-center gap-4'>
        <li>
          <FilterButton 
            dataList={StyleDataList}
            typeOfData='Style'
          />
        </li>
        <li>
          <FilterButton 
            dataList={ColorDataList}
            typeOfData='Color'
          />
        </li>
        <li>
          <FilterButton 
            dataList={MerchantDataList}
            typeOfData='Merchant'
          />
        </li>
      </ul>
      <ul className='flex items-center gap-4'>
        <li>
          <Button variant={'outline'} className='bg-white'>
            0
          </Button>
        </li>
        <li>
          <Button variant={'outline'} className='bg-white hover:bg-primary-500 hover:text-white'>
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