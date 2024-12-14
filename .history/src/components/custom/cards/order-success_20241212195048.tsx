'use client'

import React from 'react'
import { Coffee, XCircle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const SuccessOrderCard = () => {
  return (
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
          <div className="border-t-2 border-dashed border-green-300 pt-4">
          </div>
        </CardContent>
    </Card>
  )
}

export default SuccessOrderCard