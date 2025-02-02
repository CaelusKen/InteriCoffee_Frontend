'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Chrome, Facebook } from 'lucide-react'
import { getSession, signIn, useSession } from 'next-auth/react'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      redirectBasedOnRole(session.user.role)
    }
  }, [session, status])

  const redirectBasedOnRole = (role: string) => {
    switch (role.toUpperCase()) {
      case 'MANAGER':
        router.push('/manager')
        break
      case 'MERCHANT':
        router.push('/merchant')
        break
      case 'CONSULTANT':
        router.push('/consultant')
        break
      case 'CUSTOMER':
        router.push('/customer')
        break
      default:
        router.push('/')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result?.error?.match("CredentialsSignin")) {
      setError(`Incorrect email or password, please try again`)
    } else if (result?.ok) {
      // Set the access token as a cookie
      const session = await getSession()
      if (session?.user?.accessToken) {
          await fetch('/api/auth/set-access-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: session.user.accessToken }),
          })
        }
      }
    // The redirection will be handled by the useEffect hook
  }

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/login' })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Column */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex flex-col justify-between p-6 lg:p-12">
        <div>
          <Button variant={'link'} onClick={() => router.back()} className='w-fit p-0 my-2'>
            <ArrowLeft size={20} className="mr-2" />
            <p className="text-sm">Back</p>
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-8">Welcome back!</h1>
          <div className="flex items-center">
            <span className="text-4xl lg:text-6xl xl:text-8xl font-bold mr-2 lg:mr-4 text-gray-900 dark:text-white">InteriCoffee</span>
            <Image src="/placeholder.svg" alt="Logo" width={64} height={64} className="w-12 h-12 lg:w-16 lg:h-16 xl:w-24 xl:h-24" />
          </div>
        </div>
        <div className="mt-6 lg:mt-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <Link href="/signup" className="font-medium text-gray-900 dark:text-white hover:underline">Sign up now</Link>
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">Log in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs text-gray-500 dark:text-gray-400 uppercase">Email</Label>
              <Input 
                id="email" 
                type="email" 
                className="mt-1 w-full" 
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
                className="mt-1 w-full" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
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
            {error && <p className="text-red-500 w-full text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-primary-800 dark:hover:bg-primary-500 dark:hover:text-white text-white dark:text-gray-900">
              Log in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}