'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Chrome } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useToast } from "@/hooks/use-toast"

interface RegisterPageProps {
  onSubmit: (data: {
    username: string
    email: string
    password: string
    termsAccepted: boolean
  }) => void
  initialData?: {
    username?: string
    email?: string
    termsAccepted?: boolean
  }
}

export default function RegisterPage({ onSubmit, initialData }: RegisterPageProps) {
  const [username, setUsername] = useState(initialData?.username || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(initialData?.termsAccepted || false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== repeatPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }
    
    if (!termsAccepted) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      })
      return
    }
    
    onSubmit({
      username,
      email,
      password,
      termsAccepted
    })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:w-1/2 bg-gray-100 dark:bg-gray-800 p-6 lg:p-12 flex flex-col justify-between">
        <div>
          <Button variant="link" onClick={() => window.history.back()} className="w-fit p-0 my-2">
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-sm">Back</span>
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-8">Welcome!</h1>
          <div className="flex items-center">
            <span className="text-4xl lg:text-6xl xl:text-8xl font-bold mr-2 lg:mr-4 text-gray-900 dark:text-white">InteriCoffee.</span>
            <Image src="/placeholder.svg" alt="Logo" width={64} height={64} className="w-12 h-12 lg:w-16 lg:h-16 xl:w-24 xl:h-24" />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you a member? <Link href="/login" className="font-medium text-gray-900 dark:text-white hover:underline">Log In now</Link>
          </p>
        </div>
      </div>

      <div className="lg:w-1/2 bg-white dark:bg-gray-900 p-6 lg:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">Register with your e-mail</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Username (*)</Label>
              <Input 
                id="username" 
                type="text" 
                className="mt-1" 
                placeholder="Username" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Email (*)</Label>
              <Input 
                id="email" 
                type="email" 
                className="mt-1" 
                placeholder="E-mail" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Password (*)</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="mt-1" 
                  placeholder="Password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="repeat-password" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Repeat Password (*)</Label>
                <Input 
                  id="repeat-password" 
                  type="password" 
                  className="mt-1" 
                  placeholder="Repeat Password" 
                  required 
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              InteriCoffee may keep me informed with personalized emails about products and services. See our <Link href="/privacy-policy" className="text-gray-900 dark:text-white hover:underline">Privacy Policy</Link> for more details.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="contact-me" />
                <label htmlFor="contact-me" className="text-sm text-gray-600 dark:text-gray-400">Please contact me via e-mail</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">I have read and accept the Terms and Conditions</label>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            </p>
            <Button type="submit" className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-primary-800 dark:hover:bg-primary-500 dark:hover:text-white text-white dark:text-gray-900">Create Account</Button>
          </form>
        </div>
      </div>
    </div>
  )
}