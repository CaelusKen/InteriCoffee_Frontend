'use client'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react'

interface TransactionProps {
  orderId: string
}

export default function TransactionSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId, amount } = location.state || {}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-600 flex items-center justify-center">
            <CheckCircle className="mr-2" />
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-2">Thank you for your purchase!</p>
          <p className="text-gray-600 mb-4">Your order has been successfully processed.</p>
          <p className="font-semibold">Order ID: {orderId}</p>
          <p className="font-semibold">Amount Paid: {amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </CardFooter>
      </Card>
    </div>
  )
}