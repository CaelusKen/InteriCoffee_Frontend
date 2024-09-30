import React from 'react'
import { ThemeToggler } from '../../buttons/theme-toggler'
import User from '../../avatar/user-avatar'

const MerchantHeader = () => {
  return (
    <header className='px-6 py-0.5 flex justify-between items-center border-b border-white'>
      <span>InteriCoffee</span>
      <div className='flex items-center gap-4'>
        <User />
        <ThemeToggler />
      </div>
    </header>
  )
}

export default MerchantHeader