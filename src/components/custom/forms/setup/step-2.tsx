'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Store, Coffee, Check } from 'lucide-react'
import { ThemeToggler } from '../../buttons/theme-toggler'

type UserType = 'customer' | 'merchant' | 'fun'

interface SetupSecondProps {
  onSubmit: (data: { userType: UserType }) => void
  initialData?: { userType?: UserType }
}

export default function SetupSecond({ onSubmit, initialData }: SetupSecondProps) {
  const [userType, setUserType] = useState<UserType | null>(initialData?.userType || null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userType) {
      onSubmit({ userType })
    }
  }

  const options: { type: UserType; title: string; description: string; icon: React.ReactNode }[] = [
    {
      type: 'customer',
      title: 'Design Enthusiast',
      description: 'Discover unique products and create your dream spaces',
      icon: <ShoppingBag className="w-6 h-6 lg:w-8 lg:h-8" />
    },
    {
      type: 'merchant',
      title: 'Brand Visionary',
      description: 'Showcase your products and inspire with creative templates',
      icon: <Store className="w-6 h-6 lg:w-8 lg:h-8" />
    },
    {
      type: 'fun',
      title: 'Casual Explorer',
      description: 'Unleash your creativity and experiment with interior design',
      icon: <Coffee className="w-6 h-6 lg:w-8 lg:h-8" />
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-1/2 bg-gray-100 dark:bg-gray-800 p-6 lg:p-12 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-8">Welcome to InteriCoffee!</h1>
          <div className="flex items-center">
            <span className="text-4xl lg:text-6xl xl:text-8xl font-bold mr-2 lg:mr-4 text-foreground">InteriCoffee</span>
            <Image src="/placeholder.svg" alt="Logo" width={64} height={64} className="w-12 h-12 lg:w-16 lg:h-16 xl:w-24 xl:h-24" />
          </div>
        </div>
        <ThemeToggler />
      </div>
      
      <div className="lg:w-1/2 bg-white dark:bg-gray-900 p-6 lg:p-12 flex items-center">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8 w-full max-w-md mx-auto">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">How will you use InteriCoffee?</h2>
            <p className="text-sm text-muted-foreground">Select the option that best describes your purpose</p>
          </div>
          
          <div className="space-y-4">
            {options.map((option) => (
              <Card 
                key={option.type}
                className={`cursor-pointer transition-all ${
                  userType === option.type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-primary/10'
                }`}
                onClick={() => setUserType(option.type)}
              >
                <CardContent className="flex items-center p-4 lg:p-6">
                  <div className="mr-4">
                    {userType === option.type ? (
                      <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                        <Check className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                    ) : (
                      <div className="text-primary">{option.icon}</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-base lg:text-lg">{option.title}</h3>
                    <p className={`text-sm ${userType === option.type ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                      {option.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button type="submit" className="w-full" disabled={!userType}>
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}