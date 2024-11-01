import React from 'react'
import { ThemeToggler } from '../../buttons/theme-toggler'
import User from '../../avatar/user-avatar'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import Notification from '@/components/custom/notification/notification'
import { CustomAvatar } from '../../avatar/general-avatar'

const ManagerHeader = () => {
  return (
    <header className='px-6 py-[20px] flex justify-between items-center border-b border-white'>
      <span>InteriCoffee</span>
      <div className='flex items-center gap-4'>
        <Notification />
        <CustomAvatar 
          name='Manager'
          role='Manager'
          imageSrc='https://placeholder.co/200'
        />
        <ThemeToggler />
      </div>
    </header>
  )
}

export default ManagerHeader