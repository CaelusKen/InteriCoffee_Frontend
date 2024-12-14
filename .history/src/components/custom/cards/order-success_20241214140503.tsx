'use client'

import React from 'react'
import { Coffee, XCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const SuccessOrderCard = () => {
  return (
    <div>
      <Card className="w-full max-w-md mx-auto overflow-hidden bg-white shadow-lg border-2 border-green-500">
        <div className="bg-green-500 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Order Confirmed</h2>
          <Coffee className="text-white" size={24} />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Thank You!</h3>
          <p className="text-gray-600 text-center mb-4">Your coffee is being prepared with love.</p>
          <div className="border-t-2 border-dashed border-green-300 pt-4"></div>
        </CardContent>
        <CardFooter className='flex flex-col'>
          <div className="flex items-center justify-between w-full my-4">
            <Button>
              <ArrowLeft className="mr-2" size={24} />
              Return to Homepage
            </Button>
            <Link href="/furnitures" className="text-green-500 hover:text-green-600">
              Order More
            </Link>
          </div>
          <p className="text-gray-600 text-center">
            Your order number: <span className="font-semibold">#123456</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SuccessOrderCard