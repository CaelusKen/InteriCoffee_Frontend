'use client'

import React from 'react'
import { Coffee, XCircle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const FailOrderCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-white shadow-lg border-2 border-red-500">
        <div className="bg-red-500 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Order Failed</h2>
          <Coffee className="text-white" size={24} />
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-4">
            <XCircle className="text-red-500" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Oops!</h3>
          <p className="text-gray-600 text-center mb-4">Something went wrong with your order.</p>
          <div className="border-t-2 border-dashed border-red-300 pt-4">
            <p className="text-sm text-gray-500 text-center">Error Code: ERR12345</p>
            <p className="text-sm text-gray-500 text-center">Please try again or contact support.</p>
          </div>
        </CardContent>
      </Card>
  )
}

export default FailOrderCard