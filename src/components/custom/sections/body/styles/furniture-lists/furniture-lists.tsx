'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FurnitureCard from '@/components/custom/cards/furniture-card'

interface FurnitureItem {
  name: string;
  price: number;
  modelSrc?: string;
  categories: string[];
  colSpan?: number;
}

interface GridItem extends FurnitureItem {
    colSpan?: number;
  }

interface FurnitureGridProps {
  items: FurnitureItem[];
}

export default function FurnitureGrid({ items }: FurnitureGridProps) {
    const [gridItems, setGridItems] = useState<GridItem[]>(items)

    useEffect(() => {
        const totalColumns = 5
        const lastRowStart = Math.floor((items.length - 1) / totalColumns) * totalColumns
        const lastRowItemCount = items.length - lastRowStart
        
        if (lastRowItemCount < totalColumns) {
          const newItems: GridItem[] = [...items]
    
          // Dynamically adjust the colSpan for the items in the last row
          const extraCols = totalColumns - lastRowItemCount
          const colSpanIncrease = Math.floor(totalColumns / lastRowItemCount)
    
          for (let i = lastRowStart; i < items.length; i++) {
            const additionalCols = extraCols && i === items.length - 1 ? extraCols : colSpanIncrease - 1
            newItems[i] = { ...newItems[i], colSpan: 1 + additionalCols }
          }
          
          setGridItems(newItems)
        } else {
          setGridItems(items)
        }
      }, [items])

  return (
    <motion.section
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-56 mt-4 px-10"
    >
      {gridItems.map((item, index) => (
        <FurnitureCard
          key={index}
          name={item.name}
          price={item.price}
          modelSrc={item.modelSrc}
          categories={item.categories}
          colSpan={item.colSpan || 1}
        />
      ))}
    </motion.section>
  )
}
