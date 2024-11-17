'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RegisterPage from '../signup'
import SetupFirst from './step-1'
import SetupSecond from './step-2'
import SetupLast from './step-3'
import { api } from "@/service/api"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

type StyleOption = 'modern' | 'traditional' | 'eclectic';
type UserType = 'customer' | 'merchant' | 'fun';

interface SignupData {
  // Basic info
  username: string
  email: string
  password: string
  termsAccepted: boolean

  // Room preferences
  roomSize: {
    width: string
    length: string
    height: string
    measurement: string
  }
  colorPalettes: string[]
  mainStyles: StyleOption[]
  subStyles: string[]

  // User type
  userType: UserType

  // Contact info
  phoneNumber: string
  avatar?: string
  address?: string
}

export default function SignupFlow() {
  const [step, setStep] = useState(1)
  const [signupData, setSignupData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    termsAccepted: false,
    roomSize: {
      width: '',
      length: '',
      height: '',
      measurement: 'feet'
    },
    colorPalettes: [],
    mainStyles: [],
    subStyles: [],
    userType: 'customer',
    phoneNumber: '',
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleInitialSignup = async (data: Partial<SignupData>) => {
    if (!data.termsAccepted) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      })
      return
    }
    
    setSignupData(prev => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleRoomPreferences = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }))
    setStep(3)
  }

  const handleUserType = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }))
    setStep(4)
  }

  const handleFinalSetup = async (data: Partial<SignupData>) => {
    const finalData = { ...signupData, ...data }
    
    try {
      // Register the user
      const response = await api.post('auth/register', {
        "user-name": finalData.username,
        "password": finalData.password,
        "email": finalData.email,
        "phone-number": finalData.phoneNumber,
        "address": finalData.address || "",
        "avatar": finalData.avatar || ""
      })

      if (response.status === 200) {
        toast({
          title: "Your account has been created successfully!",
          description: "Please return to the login",
        })
        
        router.push('/login')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="sticky top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b z-10 p-2">
        <Progress value={step * 25} className="w-full" />
      </div>
      
      <div className="flex-grow">
        {step === 1 && (
          <RegisterPage 
            onSubmit={handleInitialSignup}
            initialData={signupData}
          />
        )}
        
        {step === 2 && (
          <SetupFirst
            onSubmit={handleRoomPreferences}
            initialData={signupData}
          />
        )}
        
        {step === 3 && (
          <SetupSecond
            onSubmit={handleUserType}
            initialData={signupData}
          />
        )}
        
        {step === 4 && (
          <SetupLast
            onSubmit={handleFinalSetup}
            initialData={signupData}
          />
        )}
      </div>
    </div>
  )
}