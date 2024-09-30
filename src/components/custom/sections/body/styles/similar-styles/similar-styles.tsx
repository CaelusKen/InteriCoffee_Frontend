'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import StyleCard from '@/components/custom/cards/style-card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const styleData = [
    { imageSrc: "https://placehold.co/400", name: "Modern Minimalist", creator: "Jane Doe" },
    { imageSrc: "https://placehold.co/400", name: "Bohemian Chic", creator: "John Smith" },
    { imageSrc: "https://placehold.co/400", name: "Industrial Loft", creator: "Emma Wilson" },
]

const SimilarStylesSection = () => {
    const router = useRouter()
  return (
    <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.6 }}
        className='grid grid-cols-3 gap-4 justify-items-center px-10 mb-24'
    >
        {styleData.map((style, index) => (
            <StyleCard 
                key={index}
                imageSrc={style.imageSrc}
                name={style.name}
                creator={style.creator}
                onViewDetails={() => router.push('/browse/styles/' + style.name)}
            />
        ))}
    </motion.div>
  )
}

export default SimilarStylesSection