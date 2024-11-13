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
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex flex-col justify-between p-12">
        <div>
          <Button variant="link" onClick={() => window.history.back()} className="w-fit p-0 my-2">
            <ArrowLeft size={24}/>
            <p>Back</p>
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Welcome!</h1>
          <div className="flex items-center">
            <span className="text-8xl font-bold mr-4 text-gray-900 dark:text-white">InteriCoffee.</span>
            <Image src="/placeholder.svg" alt="Logo" width={96} height={96} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you a member? <Link href="/login" className="font-medium text-gray-900 dark:text-white hover:underline">Log In now</Link>
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Register with your e-mail</h2>
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
            <div className="flex space-x-4">
              <div className="flex-1">
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
              <div className="flex-1">
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
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">Or register with</p>
            <div className="flex justify-between items-center gap-4">
              <Button onClick={() => signIn('google')} variant="outline" className="flex items-center justify-center w-full hover:bg-secondary-700 space-x-2">
                <Chrome size={24} />
                <span>Google</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}