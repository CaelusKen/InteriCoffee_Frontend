'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Mail, Bell } from 'lucide-react'

interface SetupLastProps {
  onSubmit: (data: {
    phoneNumber: string
    notifications: boolean
    avatar?: string
    address?: string
  }) => void
  initialData?: {
    phoneNumber?: string
    notifications?: boolean
    avatar?: string
    address?: string
  }
}

export default function SetupLast({ onSubmit, initialData }: SetupLastProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '')
  const [notifications, setNotifications] = useState(initialData?.notifications ?? true)
  const [avatar, setAvatar] = useState(initialData?.avatar || '')
  const [address, setAddress] = useState(initialData?.address || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ phoneNumber, notifications, avatar, address })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:flex-1 bg-gray-100 dark:bg-gray-800 flex flex-col justify-between p-6 lg:p-12">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-8">Almost there!</h1>
          <div className="flex items-center">
            <span className="text-4xl lg:text-8xl font-bold mr-4 text-foreground">InteriCoffee</span>
            <Image src="/placeholder.svg" alt="Logo" width={64} height={64} className="lg:w-24 lg:h-24" />
          </div>
        </div>
        <div className="mt-6 lg:mt-0">
          <p className="text-sm text-muted-foreground">
            Need help? <Link href="/support" className="font-medium text-foreground hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
      
      <div className="lg:flex-1 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8 w-full max-w-md mx-auto">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">Finish setting up your account</h2>
            <p className="text-sm text-muted-foreground">Just a few more details to get you started</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (optional)</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address (optional)</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={(checked) => setNotifications(checked as boolean)}
                  />
                  <Label htmlFor="notifications" className="text-sm cursor-pointer">
                    Receive notifications about new products and design tips
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button type="submit" className="w-full group">
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            By completing setup, you agree to our{' '}
            <Link href="/terms" className="font-medium text-foreground hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-foreground hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  )
}