'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Layers, Home, PaintBucket, ReceiptText } from 'lucide-react'
import { ThemeToggler } from '../buttons/theme-toggler'
import { useRouter } from 'next/navigation'
import { useCart } from '../cart/cart-context'
import { CartDrawer } from '../cart/cart-drawer'
import { Badge } from '@/components/ui/badge'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CustomAvatar } from '../avatar/general-avatar'
import { Separator } from '@/components/ui/separator'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { itemCount } = useCart()

  const { data: session } = useSession()

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
    { name: 'Templates', href: '/templates' },
    { name: 'Products', href: '/furnitures' },
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
          onClick={() => router.push('/')}
        >
          InteriCoffee
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
      {
        session ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white text-black" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='hover:bg-slate-100' onClick={() => router.push('/customer/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='hover:bg-slate-100' onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant={'ghost'} onClick={() => router.push('/customer')}>
              <Home size={24}/>
              <p>Home</p>
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/customer/designs')}>
              <PaintBucket className="h-4 w-4" />
              <span>Designs</span>
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/customer/orders')}>
              <ReceiptText className="h-4 w-4" />
              <span>Orders</span>
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/simulation/setup')}>
              <Layers size={24}/>
              <p>Simulate</p>
            </Button>
          </>
        ) : (
          <>
            <Button variant={'ghost'} onClick={() => router.push('/simulation')}>
              <Layers size={24}/>
              <p>Simulate</p>
            </Button>
            <Button onClick={() => router.push('/login')} variant={'link'} className='text-black dark:text-white dark:hover:text-primary-400 hover:text-primary-400 transition-colors duration-200'>
              Login
            </Button>
            <Button onClick={() => router.push('/signup')} variant={'outline'} className='rounded-md hover:bg-primary hover:text-white transition-colors duration-200'>
              Get Started
            </Button>
          </>
        ) }
        <CartDrawer>
          <Button variant='ghost' size='icon' className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                {itemCount}
              </Badge>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        </CartDrawer>
        <ThemeToggler/>
      </div>

      <div className='lg:hidden flex items-center gap-4'>
        <CartDrawer>
          <Button variant='ghost' size='icon' className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                {itemCount}
              </Badge>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        </CartDrawer>
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
            
          {
            session ? (
              <>
                <Separator />
                <CustomAvatar 
                  name={session.user.name}
                  role={session.user.role}
                  />
                <div className='text-left flex flex-col justify-start gap-4'>
                  <Button variant={'ghost'} className='flex justify-start items-center gap-4 pl-2 w-full' onClick={() => router.push('/customer')}>
                    <Home size={24}/>
                    <p>Home</p>
                  </Button>
                  <Button variant={'ghost'} className='flex justify-start items-center gap-4 pl-2 w-full' onClick={() => router.push('/customer/designs')}>
                    <PaintBucket className="h-4 w-4" />
                    <span>Designs</span>
                  </Button>
                  <Button variant={'ghost'} className='flex justify-start items-center gap-4 pl-2 w-full' onClick={() => router.push('/customer/orders')}>
                    <ReceiptText className="h-4 w-4" />
                    <span>Orders</span>
                  </Button>
                  <Button variant={'ghost'} className='flex justify-start items-center gap-4 pl-2 w-full' onClick={() => router.push('/simulation/setup')}>
                    <Layers size={24}/>
                    <p>Simulate</p>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <li className='mt-4'>
                    <Button 
                      variant={'outline'} 
                      className='w-full justify-start text-black dark:text-white hover:text-primary transition-colors duration-200'
                      onClick={() => router.push('/login')}
                    >
                      Login
                    </Button>
                </li>
                <li>
                  <Button 
                    variant={'default'} 
                    className='w-full mt-2 rounded-md hover:bg-primary hover:text-white transition-colors duration-200'
                    onClick={() => router.push('/signup')}
                  >
                    Get Started
                  </Button>
                </li>
              </>
            )
          }
          
        </ul>
      </motion.nav>
    </motion.header>
  )
}

export default Header