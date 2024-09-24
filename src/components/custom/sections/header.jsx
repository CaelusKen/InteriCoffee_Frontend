'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    const menuVariants = {
      open: { opacity: 1, x: 0 },
      closed: { opacity: 0, x: "100%" },
    }
  
    const menuItems = [
      { name: 'Styles', href: '/' },
      { name: 'Products', href: '/' },
      { name: 'About', href: '/' },
      { name: 'Contact', href: '/' },
    ]
  
    return (
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex justify-between items-center px-6 md:px-10 py-6 bg-white shadow-sm'
      >
        <div className='flex justify-between items-center gap-8'>
          <motion.h1 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='text-2xl font-bold'
          >
            Logo
          </motion.h1>
      
          <nav className='hidden md:block'>
            <ul className='flex gap-8 items-center'>
              {menuItems.map((item, index) => (
                <motion.li key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link href={item.href} className='hover:text-primary-600 transition-colors duration-200'>
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
  
        <div className='hidden md:flex gap-4 items-center'>
          <Button variant={'link'} className='text-black hover:text-primary transition-colors duration-200'>
            Login
          </Button>
          <Button variant={'outline'} className='rounded-md hover:bg-primary hover:text-white transition-colors duration-200'>
            Get Started
          </Button>
        </div>
  
        <div className='md:hidden'>
          <Button variant='ghost' size='icon' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
  
        <motion.nav 
          className='fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg p-6 z-50 md:hidden'
          animate={isOpen ? "open" : "closed"}
          variants={menuVariants}
          initial="closed"
          transition={{ duration: 0.3 }}
        >
          <ul className='flex flex-col gap-4'>
            {menuItems.map((item, index) => (
              <motion.li key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href={item.href} className='hover:text-primary transition-colors duration-200'>
                  {item.name}
                </Link>
              </motion.li>
            ))}
            <li>
              <Button variant={'link'} className='text-black hover:text-primary transition-colors duration-200'>
                Login
              </Button>
            </li>
            <li>
              <Button variant={'outline'} className='rounded-md hover:bg-primary hover:text-white transition-colors duration-200'>
                Get Started
              </Button>
            </li>
          </ul>
        </motion.nav>
      </motion.header>
    )
}

export default Header