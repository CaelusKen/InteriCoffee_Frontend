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
import IncomeChart from './income-chart'

const fetchAccountByEmail = async(email: string) : Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchTemplates = async() : Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>('templates')
}

const fetchMerchantOrders = async(merchantId: string, accessToken: string) : Promise<ApiResponse<PaginatedResponse<any>>> => {
  return api.get<any>(`orders/merchant/${merchantId}`, undefined, accessToken)
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
      const templates = data.data.items;
      return templates.filter(item => item.merchantId === merchantId);
    }
  })

  // Orders Query - depends on merchantId
  const ordersQuery = useQuery({
    queryKey: ['merchantOrders', merchantId],
    queryFn: () => fetchMerchantOrders(merchantId!, accessToken ?? ''),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5,
    select: (data) => mapBackendListToFrontend<Order>(data.data.items, 'order').items
  })

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

        {/* Income Chart */}
        {ordersQuery.data && <IncomeChart orders={ordersQuery.data} />}
      </main>
  )
}