'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import User from '../../avatar/user-avatar'
import StyleCard from '../../cards/style-card'
import { ArrowRightCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const styleData = [
  { imageSrc: "https://placehold.co/400", name: "Modern Minimalist", creator: "Jane Doe" },
  { imageSrc: "https://placehold.co/400", name: "Bohemian Chic", creator: "John Smith" },
  { imageSrc: "https://placehold.co/400", name: "Industrial Loft", creator: "Emma Wilson" },
]

const Home = () => {
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toISOString().split('T')[0]
    setCurrentDate(formattedDate)
  }, [])

  return (
    <motion.section 
      initial = {{ opacity: 0, y: -50}}
      animate = {{ opacity: 100, y: 0}}
      transition={{ duration: 0.75, delay: 0.25 }}
      
      className='px-10 py-4'>
        <motion.section
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.5 }}
          className='flex flex-col gap-4 text-center my-4'>
            <div className='flex justify-center items-center gap-4'>
              <h3 className='text-base'>Style of the Day</h3>
              <Input
                type="date"
                value={currentDate}
                disabled
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-4 py-2 border border-black rounded-md text-black bg-white cursor-default w-fit"
                style={{ WebkitTextFillColor: 'black', opacity: 1 }}
              />
              <h3 className='text-base'>Rating: 5.00 out of 5.00</h3>
            </div>
            <h1 className='uppercase text-8xl font-bold'>Modernication</h1>
            <h3>Created By:</h3>
            <div className='flex items-center justify-center gap-4'>
              <User />
              <User />
            </div>
            <img src='https://placehold.co/1600x400' width={1600} height={400} alt='Sotd'/>
        </motion.section>
        <motion.h3
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.6 }}
          className='text-xl text-center py-2'>Latest</motion.h3>
        <motion.h1
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.6 }} 
          className='text-7xl uppercase font-bold text-center py-2'>Styles Collection</motion.h1>
        <motion.h3 className='text-xl text-center py-2'>Check out all of the latest styles here</motion.h3>
        <motion.section
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }}
          >
          <div className='grid grid-cols-3 gap-8 w-full justify-items-center'>
            {styleData.map((style, index) => (
              <StyleCard 
                key={index}
                imageSrc={style.imageSrc}
                name={style.name}
                creator={style.creator}
                onViewDetails={() => console.log(`View details clicked for ${style.name}`)}
              />
            ))}
          </div>
          <div className='flex justify-center'>
            <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white'>
              <span className='flex items-center gap-2'>
                <p>Click to browse all latest styles</p>
                <ArrowRightCircle size={20}/>
              </span>
            </Button>
          </div>
        </motion.section>
        <motion.h3
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }} 
          className='text-xl text-left py-2'>Recent</motion.h3>
        <motion.h1
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }} 
          className='text-7xl uppercase font-bold text-left py-2'>Style of the Day</motion.h1>
        <motion.section
          initial = {{ opacity: 0, y: -50}}
          animate = {{ opacity: 100, y: 0}}
          transition={{ duration: 0.75, delay: 0.75 }}
          >
          <div className='grid grid-cols-3 gap-8 w-full justify-items-center'>
            {styleData.map((style, index) => (
              <StyleCard 
                key={index}
                imageSrc={style.imageSrc}
                name={style.name}
                creator={style.creator}
                onViewDetails={() => console.log(`View details clicked for ${style.name}`)}
              />
            ))}
          </div>
          <div className='flex justify-center'>
            <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white'>
              <span className='flex items-center gap-2'>
                <p>Click to browse all recent styles of the day</p>
                <ArrowRightCircle size={20}/>
              </span>
            </Button>
          </div>
        </motion.section>
    </motion.section>
  )
}

export default Home