'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Users, ShoppingBag, DollarSign, Store } from 'lucide-react'
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { Account, Merchant, Order } from "@/types/frontend/entities"
import { api } from "@/service/api"
import { useAccessToken } from "@/hooks/use-access-token"
import { useQuery } from "@tanstack/react-query"

const accountsData = [
  { month: 'Jan', accounts: 120 },
  { month: 'Feb', accounts: 150 },
  { month: 'Mar', accounts: 200 },
  { month: 'Apr', accounts: 180 },
  { month: 'May', accounts: 220 },
  { month: 'Jun', accounts: 250 },
]

//using api
const fetchAccounts = async(accessToken: string): Promise<ApiResponse<PaginatedResponse<Account>>> => {
  return api.getPaginated<Account>("accounts", undefined, accessToken)
}

const ordersData = [
  { month: 'Jan', orders: 300 },
  { month: 'Feb', orders: 400 },
  { month: 'Mar', orders: 500 },
  { month: 'Apr', orders: 450 },
  { month: 'May', orders: 550 },
  { month: 'Jun', orders: 600 },
]
const fetchOrders = async(accessToken: string): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return api.getPaginated<Order>("orders", undefined, accessToken)
}

const revenueData = [
  { month: 'Jan', revenue: 50000 },
  { month: 'Feb', revenue: 60000 },
  { month: 'Mar', revenue: 75000 },
  { month: 'Apr', revenue: 70000 },
  { month: 'May', revenue: 80000 },
  { month: 'Jun', revenue: 90000 },
]

const merchantData = [
  { name: 'Electronics', value: 30 },
  { name: 'Clothing', value: 25 },
  { name: 'Food', value: 20 },
  { name: 'Books', value: 15 },
  { name: 'Others', value: 10 },
]
const fetchMerchants = async(accessToken: string): Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
  return api.getPaginated<Merchant>('merchants', undefined, accessToken)
} 

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Dashboard()  {
  const accessToken = useAccessToken();

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetchAccounts(accessToken ?? ""),
    enabled:!!accessToken,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(accessToken?? ""),
    enabled:!!accessToken,
  });

  const { data: merchants } = useQuery({
    queryKey: ["merchants"],
    queryFn: () => fetchMerchants(accessToken?? ""),
    enabled:!!accessToken,
  });

  const accountList = accounts?.data.items ?? []
  const orderList = orders?.data.items?? []
  const merchantList = merchants?.data.items?? []
  
  const orderAmounts = orderList.map((order) => order.feeAmount)
  const totalOrderAmount = orderAmounts.reduce((acc, amount) => acc + amount, 0)

  // Create dataset for account, aggregating accounts by month
  const accountData = accountList.reduce((acc, account) => {
    const month = new Date(account.createdDate).toLocaleString("vi-VN", { month: "short" })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const accountChartData = Object.entries(accountData).map(([month, accounts]) => ({ month, accounts }))

  // Create dataset for order, aggregating orders by month
  const orderData = orderList.reduce((acc, order) => {
    const month = new Date(order.updatedDate).toLocaleString("vi-VN", { month: "short" })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const orderChartData = Object.entries(orderData).map(([month, orders]) => ({ month, orders }))

  // Create dataset for revenue, aggregating revenue by month
  const revenueData = orderList.reduce((acc, order) => {
    const month = new Date(order.updatedDate).toLocaleString("vi-VN", { month: "short" })
    acc[month] = (acc[month] || 0) + order.feeAmount
    return acc
  }, {} as Record<string, number>)

  const revenueChartData = Object.entries(revenueData).map(([month, revenue]) => ({ month, revenue }))

  return (
    <div className="text-foreground">
      <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountList.length}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderList.filter((order) => order.status !== "CREATED").length}</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrderAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND"})}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchantList.filter((merchant) => merchant.status === "ACTIVE").length}</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 mt-8 md:grid-cols-3">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                  formatter={(value) => [value.toLocaleString("vi-VN", { style: "currency", currency: "VND"}), 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Account Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accountChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Bar dataKey="accounts" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Order Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
