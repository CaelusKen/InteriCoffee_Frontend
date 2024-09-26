'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import StyleCard from '../../cards/style-card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const styleData = [
  { imageSrc: "https://placehold.co/400", name: "Modern Minimalist", creator: "Jane Doe" },
  { imageSrc: "https://placehold.co/400", name: "Bohemian Chic", creator: "John Smith" },
  { imageSrc: "https://placehold.co/400", name: "Industrial Loft", creator: "Emma Wilson" },
]

const BrowseStyle = () => {
  const router = useRouter()

  return (
    <main>
      <motion.section
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }}
          className='py-8 px-10'
          >
            <span className='flex items-center justify-between py-2'>
              <h3 className='text-md font-semibold'>Showing 18 results</h3>
              <h3 className='text-md font-semibold'>Page 1 out of 3 pages</h3>
            </span>
          <div className='grid grid-cols-3 gap-4 justify-items-center'>
            {styleData.map((style, index) => (
              <StyleCard 
                key={index}
                imageSrc={style.imageSrc}
                name={style.name}
                creator={style.creator}
                onViewDetails={() => router.push('/browse/styles/' + style.name)}
              />
            ))}
          </div>
      </motion.section>
    </main>
  )
}

export default BrowseStyle