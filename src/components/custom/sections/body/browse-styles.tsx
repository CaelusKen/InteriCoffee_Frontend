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
  { imageSrc: "https://placehold.co/400", name: "Scandinavian Simplicity", creator: "Alex Johnson" },
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
          className='py-8'
          >
          <div className='grid grid-cols-4 md:grid-cols-3 w-full justify-items-center'>
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
          {/* <div className='flex justify-center'>
            <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white'>
              <span className='flex items-center gap-2'>
                <p>Click to browse all latest styles</p>
                <ArrowRightCircle size={20}/>
              </span>
            </Button>
          </div> */}
      </motion.section>
      <motion.section
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }}
          className='py-8'
          >
          <div className='grid grid-cols-3 gap-8 w-full justify-items-center'>
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
          {/* <div className='flex justify-center'>
            <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white'>
              <span className='flex items-center gap-2'>
                <p>Click to browse all latest styles</p>
                <ArrowRightCircle size={20}/>
              </span>
            </Button>
          </div> */}
      </motion.section>
      <motion.section
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }}
          className='py-8'
          >
          <div className='grid grid-cols-3 gap-8 w-full justify-items-center'>
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
          {/* <div className='flex justify-center'>
            <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white'>
              <span className='flex items-center gap-2'>
                <p>Click to browse all latest styles</p>
                <ArrowRightCircle size={20}/>
              </span>
            </Button>
          </div> */}
      </motion.section>
    </main>
  )
}

export default BrowseStyle