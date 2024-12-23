'use client'

import React, { useState } from 'react'
import { BarChart, MessageSquare, Package, Palette, DollarSign, Users, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Order, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useAccessToken } from '@/hooks/use-access-token'
import { mapBackendListToFrontend, mapBackendToFrontend } from '@/lib/entity-handling/handler'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchTemplates = async() : Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>('templates')
}

const fetchMerchantOrders = async(merchantId: string) : Promise<ApiResponse<PaginatedResponse<any>>> => {
  return api.get<any>(`orders/merchant/${merchantId}`)
}

export default function Dashboard() {
  const { data: session } = useSession();
  const accessToken = useAccessToken();

  // Account Query
  const accountQuery = useQuery({
    queryKey: ['accountByEmail', session?.user.email],
    queryFn: () => fetchAccountByEmail(session?.user.email ?? ''),
    enabled: !!session?.user.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Get merchant ID from account data
  const merchantId = accountQuery.data?.data ? 
    mapBackendToFrontend<Account>(accountQuery.data.data, 'account').merchantId : 
    null;

  // Templates Query - depends on merchantId
  const templateQuery = useQuery({
    queryKey: ['templates', merchantId],
    queryFn: () => fetchTemplates(),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      const templates = mapBackendListToFrontend<Template>(data.data.items, 'template').items;
      return templates.filter(item => item.merchantId === merchantId);
    }
  })

  // Orders Query - depends on merchantId
  const ordersQuery = useQuery({
    queryKey: ['merchantOrders', merchantId],
    queryFn: () => fetchMerchantOrders(merchantId!),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5,
    select: (data) => mapBackendListToFrontend<Order>(data.data.items, 'order').items
  })

  console.log(ordersQuery.data);
  

  // Calculate total sales only when we have orders
  const totalSales = ordersQuery.data?.reduce((sum, order) => sum + order.totalAmount, 0) ?? 0

  // Loading state
  if (accountQuery.isLoading || templateQuery.isLoading || ordersQuery.isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  // Error state
  if (accountQuery.isError || templateQuery.isError || ordersQuery.isError) {
    return <div className="container mx-auto px-4 py-8">Error loading dashboard data</div>
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
        
        {/* Overview Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              title: "Total Sales", 
              icon: DollarSign, 
              value: totalSales.toLocaleString('vi-VN', { style:'currency', currency: 'VND' }), 
              trend: "+5.2%" 
            },
            { 
              title: "Active Styles", 
              icon: Palette, 
              value: templateQuery.data?.length ?? 0, 
              trend: "+2" 
            },
            { 
              title: "New Messages", 
              icon: MessageSquare, 
              value: "24", 
              trend: "+10" 
            },
            { 
              title: "Ongoing Campaigns", 
              icon: TrendingUp, 
              value: "3", 
              trend: "0" 
            }
          ].map((item) => (
            <Card key={item.title} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.trend.startsWith('+') ? (
                    <span className="text-green-500">{item.trend}</span>
                  ) : item.trend.startsWith('-') ? (
                    <span className="text-red-500">{item.trend}</span>
                  ) : (
                    <span className="text-yellow-500">{item.trend}</span>
                  )}
                  {' '}from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Section */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className='flex justify-between items-center'>
              <p>Imported Products</p>
              <Link href={'/merchant/product'} className='flex items-center gap-2'>
                <p className='text-sm text-gray-600 dark:text-white hover:underline'>Click to view all imported products</p>
                <ArrowRight />
              </Link>
            </CardTitle>
            <CardDescription>Overview of your recent product imports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Vintage Floral Dress", category: "Apparel", price: "$79.99", stock: 50 },
                  { name: "Handcrafted Leather Bag", category: "Accessories", price: "$129.99", stock: 30 },
                  { name: "Artisanal Scented Candle", category: "Home Decor", price: "$24.99", stock: 100 },
                ].map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Template Styles Section */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className='flex justify-between items-center'>
              <p>Published Template Styles</p>
              <Link href={'/merchant/styles'} className='flex items-center gap-2'>
                <p className='text-sm text-gray-600 dark:text-white hover:underline'>Click to view all template styles</p>
                <ArrowRight />
              </Link>
            </CardTitle>
            <CardDescription>Styles created by your consultants</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Style Name</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Date Published</TableHead>
                  <TableHead>Usage Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Bohemian Chic", creator: "Emma Watson", date: "2023-06-15", usage: 42 },
                  { name: "Urban Streetwear", creator: "Alex Chen", date: "2023-06-10", usage: 28 },
                  { name: "Eco-Friendly Minimalist", creator: "Olivia Green", date: "2023-06-05", usage: 35 },
                ].map((style) => (
                  <TableRow key={style.name}>
                    <TableCell className="font-medium">{style.name}</TableCell>
                    <TableCell>{style.creator}</TableCell>
                    <TableCell>{style.date}</TableCell>
                    <TableCell>{style.usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Messages Section */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Customer Messages</CardTitle>
            <CardDescription>Assign consultants to respond</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { customer: "Lily Thompson", subject: "Custom Order Inquiry", date: "2023-06-20", status: "Unassigned" },
                  { customer: "James Wilson", subject: "Sizing Question", date: "2023-06-19", status: "Assigned" },
                  { customer: "Sophia Chen", subject: "Eco-friendly Products", date: "2023-06-18", status: "Unassigned" },
                ].map((message) => (
                  <TableRow key={message.customer}>
                    <TableCell className="font-medium">{message.customer}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{message.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        message.status === "Unassigned" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                      }`}>
                        {message.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {message.status === "Unassigned" ? "Assign" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your earnings from product sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Total Revenue:</span>
                <span className="ml-auto font-bold">$52,680.45</span>
              </div>
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Top Selling Product:</span>
                <span className="ml-auto">Vintage Floral Dress</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Top Performing Consultant:</span>
                <span className="ml-auto">Emma Watson</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
  )
}