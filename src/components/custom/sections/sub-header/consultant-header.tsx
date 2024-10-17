'use client'

import React from 'react'
import { ThemeToggler } from '../../buttons/theme-toggler'
import { motion } from 'framer-motion'
import { CustomAvatar } from '../../avatar/general-avatar'

const ConsultantHeader = () => {
  return (
    <motion.header
      initial={{y: -50, opacity: 0}}
      animate={{y: 0, opacity: 100}}
      transition={{duration: 0.5, delay: 0.5}} 
      className='px-6 py-[20px] flex justify-between items-center border-b border-white'>
      <span>InteriCoffee</span>
      <div className='flex items-center gap-4'>
        <CustomAvatar 
          name='Consultant'
          role='Consultant'
          imageSrc='https://placeholder.co/200'
        />
        <ThemeToggler />
      </div>
    </motion.header>
  )
}

export default ConsultantHeader