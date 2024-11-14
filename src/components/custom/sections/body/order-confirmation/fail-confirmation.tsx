import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from 'lucide-react'

export default function TransactionFailure() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId, errorMessage } = location.state || {}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600 flex items-center justify-center">
            <XCircle className="mr-2" />
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-2">We're sorry, but your payment could not be processed.</p>
          <p className="text-gray-600 mb-4">Please try again or contact customer support.</p>
          {orderId && <p className="font-semibold">Order ID: {orderId}</p>}
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={() => navigate('/checkout')}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Return to Home</Button>
        </CardFooter>
      </Card>
    </div>
  )
}