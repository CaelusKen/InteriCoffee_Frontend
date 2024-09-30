'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggler } from '../buttons/theme-toggler'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();

  // Close menu when screen size changes to prevent menu from staying open on larger screens
  useEffect(() => {
    const handleResize = () => setIsOpen(false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  }

  const menuItems = [
    { name: 'Styles', href: '/browse/styles' },
    { name: 'Products', href: '/browse/furnitures' },
    { name: 'About', href: '/' },
    { name: 'Contact', href: '/' },
  ]

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 bg-white dark:bg-black dark:text-white shadow-sm'
    >
      <div className='flex justify-between items-center gap-4 sm:gap-8'>
        <motion.h1 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='text-xl sm:text-2xl font-bold'
        >
          Logo
        </motion.h1>
    
        <nav className='hidden lg:block'>
          <ul className='flex gap-4 sm:gap-8 items-center'>
            {menuItems.map((item, index) => (
              <motion.li key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href={item.href} className='hover:text-primary-400 transition-colors duration-200'>
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>

      <div className='hidden lg:flex gap-4 items-center'>
        <Button variant={'link'} className='text-black dark:text-white dark:hover:text-primary-400 hover:text-primary-400 transition-colors duration-200'>
          Login
        </Button>
        <Button variant={'outline'} className='rounded-md hover:bg-primary hover:text-white transition-colors duration-200'>
          Get Started
        </Button>
        <ThemeToggler/>
      </div>

      <div className='lg:hidden'>
        <Button variant='ghost' size='icon' onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav 
        className='fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-black shadow-lg p-6 z-50 lg:hidden'
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        initial="closed"
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant='ghost' 
          size='icon' 
          className='absolute top-4 right-4'
          onClick={() => setIsOpen(false)}
        >
          <X />
        </Button>
        <ul className='flex flex-col gap-4 mt-12'>
          {menuItems.map((item, index) => (
            <motion.li key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link 
                href={item.href} 
                className='block py-2 hover:text-primary transition-colors duration-200'
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </motion.li>
          ))}
          <li className='mt-4'>
            <Link href={'/login'}>
              <Button 
                variant={'link'} 
                className='w-full justify-start text-black dark:text-white hover:text-primary transition-colors duration-200'
              >
                Login
              </Button>
            </Link>
          </li>
          <li>
            <Button 
              variant={'outline'} 
              className='w-full mt-2 rounded-md hover:bg-primary hover:text-white transition-colors duration-200'
              onClick={() => router.push('/signup')}
            >
              Get Started
            </Button>
          </li>
        </ul>
      </motion.nav>
    </motion.header>
  )
}

export default Header