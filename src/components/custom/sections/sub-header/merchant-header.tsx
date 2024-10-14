'use client'

import React from 'react'
import { ThemeToggler } from '../../buttons/theme-toggler'
import User from '../../avatar/user-avatar'
import { motion } from 'framer-motion'
import { CustomAvatar } from '../../avatar/general-avatar'

const MerchantHeader = () => {
  return (
    <motion.header
      initial={{y: -50, opacity: 0}}
      animate={{y: 0, opacity: 100}}
      transition={{duration: 0.5, delay: 0.5}} 
      className='px-6 py-8 flex justify-between items-center border-b border-white'>
      <span>InteriCoffee</span>
      <div className='flex items-center gap-4'>
        <CustomAvatar 
          name='Merchant'
          role='Merchant'
          imageSrc='https://placeholder.co/200'
        />
        <ThemeToggler />
      </div>
    </motion.header>
  )
}

export default MerchantHeader