'use client'

import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useCart } from '../cart/cart-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { ApiResponse } from '@/types/api'
import { Account, Order, Product } from '@/types/frontend/entities'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchProductById = async(id: string): Promise<ApiResponse<Product>> => {
  return api.getById<Product>(`products`, id)
}

const fetchOrders = async(): Promise<ApiResponse<Order[]>> => {
  return api.get<Order[]>('orders')
}

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  paymentMethod: z.enum(['COD', 'VNPay', 'PayPal']),
})

type FormValues = z.infer<typeof formSchema>

export default function CheckoutForm() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { data: session } = useSession()
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetchAccountByEmail(session?.user?.email)
        .then((res) => {
          const mappedAccount = mapBackendToFrontend<Account>(res.data, 'account')
          setAccount(mappedAccount)
        }).catch((error) => {
          toast.error(`Error get account with error: ${error}`)
        })
    }
  }, [session])

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: account?.userName || session?.user?.name || '',
      email: account?.email || session?.user?.email || '',
      phoneNumber: account?.phoneNumber || '',
      address: account?.address || '',
      city: '',
      postalCode: '',
      paymentMethod: 'COD',
    },
  })

  useEffect(() => {
    if (account) {
      methods.reset({
        fullName: account.userName || session?.user?.name || '',
        email: account.email || session?.user?.email || '',
        phoneNumber: account.phoneNumber || '',
        address: account.address || '',
        city: '',
        postalCode: '',
        paymentMethod: 'COD',
      })
    }
  }, [account, session, methods])

  const createOrder = async (formData: FormValues) => {
    const productDetails = await Promise.all(
      items.map(async (item) => {
        try {
          const response = await fetchProductById(item.id)
          return { ...response.data, quantity: item.quantity }
        } catch (error) {
          console.error(`Failed to fetch details for product ${item.id}:`, error)
          throw new Error(`Failed to fetch details for product ${item.name}`)
        }
      })
    )

    const orderData = {
      vat: 10,
      "fee-amount": 0,
      "total-amount": total,
      "shipping-address": `${formData.address}, ${formData.city}, ${formData.postalCode}`,
      "order-products": productDetails.map(product => ({
        "_id": product.id,
        name: product.name,
        description: product.description,
        price: product.truePrice,
        quantity: product.quantity,
        "merchant-id": product.merchantId
      })),
      "account-id": account?.id || '',
      "voucher-id": ''
    }

    const response = await api.post<{id: string}>('orders', orderData)
    console.log(response.data.id)
    return response.data
  }

  const createVNPayTransaction = async (orderId: string, formData: FormValues) => {
    const transactionData = {
      "account-id": account?.id,
      "order-id": orderId,
      "full-name": formData.fullName,
      "description": `Payment for order ${orderId}`,
      "total-amount": total,
      "payment-method": "VNPay",
      "currency": "VND"
    }

    const response = await api.post<{ url: string }>('transactions/vnpay', transactionData)
    return response.data
  }

  const onSubmit = async (values: FormValues) => {
    setIsProcessing(true)
    try {
      const orderResponse = await createOrder(values)

      const orderId = typeof orderResponse === 'string' ? orderResponse : orderResponse.id
      
      if (values.paymentMethod === 'VNPay') {
        const vnpayResponse = await createVNPayTransaction(orderId, values)
        console.log(JSON.stringify(vnpayResponse.url))
        clearCart()
        window.location.href = vnpayResponse.url
      } else if (values.paymentMethod === 'PayPal') {
        toast.error('PayPal payment is not implemented yet')
      } else {
        clearCart()
        toast.success('Order placed successfully!')
        // router.push(`/order-confirmation/success`)
      }
    } catch (error) {
      console.error('Error processing order:', error)
      // router.push(`/order-confirmation/fail`)
      toast.error('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/intericoffee-442da.appspot.com/o/pngwing.com.png?alt=media&token=d447744e-87fb-4834-bb1f-13bdbdf3e821"
          alt="Empty Cart"
          className="w-[480px] h-auto object-cover mb-4"
        />
        <p className="text-center text-lg font-medium">Your cart is empty! Cannot checkout</p>
        <p className="text-center text-gray-500">Please add some items to cart before continuing</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-8xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <Form {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={methods.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+84 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Ho Chi Minh City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="70000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <div className="lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="text-xl font-bold mt-4 text-right">
                  Total: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </div>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Payment Method</h2>
                <FormField
                  control={methods.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Tabs onValueChange={field.onChange} defaultValue={field.value} className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="COD">COD</TabsTrigger>
                            <TabsTrigger value="VNPay">VNPay</TabsTrigger>
                            <TabsTrigger value="PayPal">PayPal</TabsTrigger>
                          </TabsList>
                          <TabsContent value="COD" className="mt-2">
                            Pay with cash upon delivery to your shipping address.
                          </TabsContent>
                          <TabsContent value="VNPay" className="mt-2">
                            Pay securely with VNPay - Vietnam's trusted payment gateway.
                          </TabsContent>
                          <TabsContent value="PayPal" className="mt-2">
                            Pay internationally with PayPal (Coming soon).
                          </TabsContent>
                        </Tabs>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-4 mt-6">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isProcessing}
                    onClick={methods.handleSubmit(onSubmit)}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}