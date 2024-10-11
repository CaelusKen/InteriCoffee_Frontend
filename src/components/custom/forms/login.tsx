'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Chrome, Facebook } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useState, FormEvent } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result?.error) {
      // Handle error (e.g., show error message)
    } else {
      // Redirect to dashboard or home page
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Column */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex flex-col justify-between p-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Welcome back!</h1>
          <div className="flex items-center">
            <span className="text-8xl font-bold mr-4 text-gray-900 dark:text-white">InteriCoffee</span>
            <Image src="/placeholder.svg" alt="Logo" width={96} height={96} />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <Link href="/signup" className="font-medium text-gray-900 dark:text-white hover:underline">Sign up now</Link>
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Log in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Email</Label>
              <Input 
                id="email" 
                type="email" 
                className="mt-1" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="mt-1" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm font-medium text-gray-900 dark:text-white hover:underline">
                Forgot your password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-primary-800 dark:hover:bg-primary-500 dark:hover:text-white text-white dark:text-gray-900">
              Log in
            </Button>
          </form>
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">Or log in with</p>
            <div className="flex justify-between gap-4">
              <Button onClick={() => signIn('google')} variant="outline" className="flex items-center justify-center space-x-2 w-full hover:bg-secondary-700">
                <Chrome size={24}/>
                <span>Google</span>
              </Button>
              <Button onClick={() => signIn('facebook')} variant="outline" className="flex items-center justify-center space-x-2 w-full hover:bg-secondary-700">
                <Facebook size={24}/>
                <span>Facebook</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}