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
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Merchant, Product, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
      "https://placehold.co/300", "https://placehold.co/300","https://placehold.co/300"
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
      "https://placehold.co/300", "https://placehold.co/300","https://placehold.co/300"
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
      "https://placehold.co/300", "https://placehold.co/300","https://placehold.co/300"
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
      "https://placehold.co/300", "https://placehold.co/300","https://placehold.co/300"
    ],
    modelUrl: "/assets/3D/table.glb",
    price: 399.99,
    category: "Tables",
  },
]

const fetchTemplates = async() : Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>('templates')
}

const fetchMerchantById = async (
  id: string
): Promise<ApiResponse<Merchant>> => {
  return api.getById("merchants", id);
};

const fetchProducts = async() : Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>('products')
}

const Home = () => {
  const [currentDate, setCurrentDate] = useState('')
  const [merchant, setMerchant] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0])
  })

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  })

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  })

  const getMerchantById = (id: string) => {
    fetchMerchantById(id).then((res) => {
      if (res.status === 200) {
        setMerchant(res.data.name);
      } else throw new Error("Failed to fetch merchant");
    });
    return merchant || '';
  };

  // Get a random template for each day in a list of templates, using random index
  const randomTemplate = templates?.data.items[Math.floor(Math.random() * templates.data.items.length)]

  // Get the 3 most recent template
  const recentTemplates = templates?.data.items
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 3);
    
  const highlightTemplates = templates?.data.items
    .sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime())
    .slice(0, 3);

  // Get 4 random products
  const randomProducts = productsData?.data.items.filter((_, index) => index < 4)

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
        <h1 className='uppercase text-4xl sm:text-6xl md:text-8xl font-bold'>{randomTemplate?.name}</h1>
        <div className='flex items-center justify-center gap-4'>
          <p className="text-lg text-muted-foreground">
            Created by:{" "}
            <Link href={`/merchants/${randomTemplate?.merchantId}`}>
              {getMerchantById(randomTemplate?.merchantId || "")}
            </Link>
          </p>
        </div>
        <img src={randomTemplate?.imageUrl} className='w-full h-auto' alt='Style of the Day'/>
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
          {highlightTemplates?.map((hightlightTemplate, index) => (
            <StyleCard 
              key={index}
              imageSrc={hightlightTemplate.imageUrl}
              name={hightlightTemplate.name}
              creator={getMerchantById(hightlightTemplate.merchantId)}
              onViewDetails={() => router.push(`/templates/${hightlightTemplate.id}`)}
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
          {randomProducts?.map((product, index) => (
            <FurnitureProductCard 
              key={index}
              id={product.id}
              images={product.images.normalImages}
              merchant={product.merchantId}
              modelUrl={product.modelTextureUrl}
              name={product.name}
              price={product.sellingPrice}
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
          {recentTemplates?.map((recentTemplate, index) => (
            <StyleCard 
              key={index}
              imageSrc={recentTemplate.imageUrl}
              name={recentTemplate.name}
              creator={getMerchantById(recentTemplate.merchantId)}
              onViewDetails={() => router.push(`/templates/${recentTemplate.id}`)}
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