'use client'

import React from 'react'
import { Coffee, XCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'

const SuccessOrderCard = () => {
  return (
    <div>
      <Card className="w-full max-w-md mx-auto overflow-hidden bg-white shadow-lg border-2 border-green-500">
        <div className="bg-green-500 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Order Confirmed</h2>
          <Coffee className="text-white" size={24} />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Thank You!</h3>
          <p className="text-gray-600 text-center mb-4">Your coffee is being prepared with love.</p>
          <div className="border-t-2 border-dashed border-green-300 pt-4"></div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <Link href="/" className="text-green-500 hover:text-green-600">
              <ArrowLeft size={24} />
              Go back to Home
            </Link>
            <Link href="/order" className="text-green-500 hover:text-green-600">
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