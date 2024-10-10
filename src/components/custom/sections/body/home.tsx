'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import User from '../../avatar/user-avatar'
import StyleCard from '../../cards/style-card'
import { ArrowRightCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import EndingCard from '../../cards/ending-card'
import RatingCard from '../../cards/rating-cards'
import StyleSubHeader from '../sub-header/style-sub-header'
import FurnitureProductCard from '../../cards/furniture-card-v2'

const styleData = [
  { imageSrc: "https://placehold.co/400", name: "Modern Minimalist", creator: "Jane Doe" },
  { imageSrc: "https://placehold.co/400", name: "Bohemian Chic", creator: "John Smith" },
  { imageSrc: "https://placehold.co/400", name: "Industrial Loft", creator: "Emma Wilson" },
]

const products = [
  {
    id: '1',
    name: "Modern Chair",
    merchant: "FurniCraft",
    images: [
      { src: "https://placehold.co/300", alt: "Modern Chair" },
      { src: "https://placehold.co/300", alt: "Modern Chair" },
      { src: "https://placehold.co/300", alt: "Modern Chair" }
    ],
    modelUrl: "/assets/3D/modern-chair.glb",
    price: 199.99,
    category: "Chairs",
  },
  {
    id: '2',
    name: "Classic Coffee Table",
    merchant: "WoodWorks",
    images: [
      { src: "https://placehold.co/400", alt: "Classic Coffee Table" },
      { src: "https://placehold.co/400", alt: "Classic Coffee Table" },
      { src: "https://placehold.co/400", alt: "Classic Coffee Table" }
    ],
    modelUrl: "/assets/3D/classic-coffee-table.glb",
    price: 299.99,
    category: "Tables",
  },
  {
    id: '3',
    name: "Cozy Sofa",
    merchant: "ComfortZone",
    images: [
      { src: "https://placehold.co/500", alt: "Cozy Sofa" },
      { src: "https://placehold.co/500", alt: "Cozy Sofa" },
      { src: "https://placehold.co/500", alt: "Cozy Sofa" }
    ],
    modelUrl: "/assets/3D/sofa.glb",
    price: 599.99,
    category: "Sofas",
  },
  {
    id: '4',
    name: "Dining Table",
    merchant: "DineDesign",
    images: [
      { src: "https://placehold.co/600", alt: "Dining Table" },
      { src: "https://placehold.co/600", alt: "Dining Table" },
      { src: "https://placehold.co/600", alt: "Dining Table" }
    ],
    modelUrl: "/assets/3D/table.glb",
    price: 399.99,
    category: "Tables",
  },
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
      initial={{ opacity: 0, y: -50}}
      animate={{ opacity: 1, y: 0}}
      transition={{ duration: 0.75, delay: 0.25 }}
      className='px-4 sm:px-6 md:px-10 py-4'
    >
      <StyleSubHeader/>
      <motion.section
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.5 }}
        className='flex flex-col gap-4 text-center mt-10 mb-56'
      >
        <div className='flex flex-col sm:flex-row justify-center items-center gap-4 cursor-default'>
          <h3 className='text-sm sm:text-base'>Style of the Day</h3>
          <Input
            type="date"
            value={currentDate}
            disabled
            onChange={(e) => setCurrentDate(e.target.value)}
            className="px-2 sm:px-4 py-1 sm:py-2 border border-black rounded-md text-black bg-white w-fit text-xs sm:text-sm"
            style={{ WebkitTextFillColor: 'black', opacity: 1 }}
          />
        </div>
        <h1 className='uppercase text-4xl sm:text-6xl md:text-8xl font-bold'>Modernication</h1>
        <div className='flex items-center justify-center gap-4'>
          <h3 className='text-sm sm:text-base'>Created By:</h3>
          <div className='flex items-center justify-center gap-4'>
            <User />
            <User />
          </div>
        </div>
        <img src='https://placehold.co/1600x400' className='w-full h-auto' alt='Style of the Day'/>
      </motion.section>
      <motion.h3
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.6 }}
        className='text-lg sm:text-xl text-center py-2'
      >
        Latest
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.6 }} 
        className='text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-center py-2'
      >
        Styles Collection
      </motion.h1>
      <motion.h3 
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.6 }}
        className='text-lg sm:text-xl text-center py-2'>
        Check out all of the latest styles here
      </motion.h3>
      <motion.section
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full justify-items-center'>
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
        <div className='flex justify-center mt-6 mb-40'>
          <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white text-sm sm:text-base'>
            <span className='flex items-center gap-2'>
              <p>Click to browse all latest styles</p>
              <ArrowRightCircle size={16} />
            </span>
          </Button>
        </div>
      </motion.section>
      <motion.h3
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }} 
        className='text-lg sm:text-xl text-left py-2 mt-40'
      >
        Highlight
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }} 
        className='text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left py-2'
      >
        Furniture Products
      </motion.h1>
      <motion.h3 
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.6 }}
        className='text-lg sm:text-xl py-2'>
        Check out all of the latest furniture items here
      </motion.h3>
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full justify-items-center'>
          {products.map((product, index) => (
            <FurnitureProductCard 
              key={index}
              id={product.id}
              images={product.images}
              merchant={product.merchant}
              modelUrl={product.modelUrl}
              name={product.name}
              price={product.price}
            />
          ))}
      </section>
      <div className='flex justify-center items-center mt-10'>
        <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white text-sm sm:text-base'>
          <span className='flex items-center gap-2'>
            <p>Click to browse all products</p>
            <ArrowRightCircle size={16} />
          </span>
        </Button>
      </div>
      <motion.h3
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }} 
        className='text-lg sm:text-xl text-left py-2 mt-40'
      >
        Recent
      </motion.h3>
      <motion.h1
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }} 
        className='text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left py-2'
      >
        Style of the Day
      </motion.h1>
      <motion.section
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }}
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full justify-items-center'>
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
        <div className='flex justify-center mt-6'>
          <Button variant={'outline'} className='hover:bg-primary-500 hover:text-white text-sm sm:text-base'>
            <span className='flex items-center gap-2'>
              <p>Click to browse all recent styles of the day</p>
              <ArrowRightCircle size={16} />
            </span>
          </Button>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: -50}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.75, delay: 0.75 }}
        className='mt-56 mb-4'
      >
        <div className="grid md:grid-cols-2 gap-8 py-8">
          <EndingCard
            title="Share your style"
            heading="Be our merchant, and show us your true colors"
            description="Get your styles to every users around the globe"
            buttonText="Register now"
            backgroundImage="/placeholder.svg?height=400&width=600"
          />
          <EndingCard
            title="Be a member"
            heading="Get access to special pro features"
            description="Unlock exclusive benefits and tools for professionals."
            buttonText="Be Pro"
            backgroundImage="/placeholder.svg?height=400&width=600"
          />
        </div>
      </motion.section>
    </motion.section>
  )
}

export default Home