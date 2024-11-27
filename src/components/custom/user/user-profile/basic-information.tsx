"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Mail, Phone, MessageSquare, ShoppingBag, Pencil, Component, MessageSquareText } from "lucide-react"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { Account, APIDesign, Order } from "@/types/frontend/entities"
import { api } from "@/service/api"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { mapBackendListToFrontend, mapBackendToFrontend } from "@/lib/entity-handling/handler"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useAccessToken } from "@/hooks/use-access-token"
import CustomerDesignCard from "../../cards/customer-design-card"

interface Activity {
  type: "message" | "purchase" | "design"
  content: string
  date: string
}

const fetchAccount = async (email: string): Promise<ApiResponse<Account>> => {
  const response = await api.get(`accounts/${email}/info`)
  return {
    ...response,
    data: mapBackendToFrontend<Account>(response.data, 'account')
  }
}

const fetchOrders = async (accessToken: string): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return await api.getPaginated<Order>('orders', undefined, accessToken)
}

const fetchDesigns = async (accessToken: string): Promise<ApiResponse<PaginatedResponse<APIDesign>>> => {
  return await api.getPaginated<APIDesign>('designs', undefined, accessToken)
}

export default function CustomerProfilePage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data: session } = useSession()

  const router = useRouter()

  const accessToken = useAccessToken()
  
  const accountQuery = useQuery({
    queryKey: ['account', session?.user.email],
    queryFn: () => fetchAccount(session?.user?.email || ''),
    enabled: !!session?.user?.email
  })

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders(accessToken ?? '')
  })

  const designsQuery = useQuery({
    queryKey: ['designs'],
    queryFn: () => fetchDesigns(accessToken?? '')
  })

  const account = accountQuery.data?.data

  const orders = ordersQuery.data?.data?.items ?? []

  const designs = designsQuery.data?.data?.items?? []

  const accountOrders = orders
    .filter((order) => order.accountId === account?.id)
    .sort((a, b) => b.updatedDate.getTime() - a.updatedDate.getTime())
    .slice(0, 5)
  
  const accountDesigns = designs
    .filter((design) => design.accountId === account?.id)
    .sort((a, b) => b.updateDate.getTime() - a.updateDate.getTime())
    .slice(0, 3)

  
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "purchase":
        return <ShoppingBag className="h-4 w-4" />
      case "design":
        return <Pencil className="h-4 w-4" />
    }
  }

  return (
    <div className="mx-auto py-8 px-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile</CardTitle>
                <div className="flex items-center gap-2">
                  <Button className="bg-warning-500 hover:bg-warning-600">Edit profile</Button>
                  <Button 
                    onClick={() => router.push(`/customer/profile/merchant-registration`)}
                    className="bg-success-700 dark:bg-success-600 hover:bg-success-600 dark:hover:bg-success-700">
                    Register as Merchant
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={account?.avatar} alt={account?.userName} />
                  <AvatarFallback>{session?.user?.name}</AvatarFallback>
                </Avatar>
                <h2>{account?.userName}</h2>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{session?.user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{account?.phoneNumber || "No phone number"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <p>Recent Purchases</p>
                <Button>View all orders</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                      <TableHead className="w-[100px]">No.</TableHead>
                      <TableHead>Order Id</TableHead>
                      <TableHead>Shipping Address</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Order Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountOrders.map((accountOrder, index) => (
                    <TableRow key={accountOrder.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{accountOrder.id}</TableCell>
                        <TableCell>{accountOrder.shippingAddress}</TableCell>
                        <TableCell>{accountOrder.updatedDate.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{accountOrder.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex justify-between">
              <p>Recent Designs</p>
              <div className="flex gap-4">
                <Button onClick={() => router.push('/customer/designs')}>View all designs</Button>
                <Button className="bg-success-700 dark:bg-success-600 hover:bg-success-600 dark:hover:bg-success-700" onClick={() => router.push('/simulation/setup')}>
                  <Component size={24} />
                  Create design
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {accountDesigns.map((design) => (
                  <CustomerDesignCard key={design.id} design={design} />
                ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <p>Recent Chat</p>
              <div className="flex gap-4">
                <Button>View all chats</Button>
                <Button className="bg-success-700 dark:bg-success-600 hover:bg-success-600 dark:hover:bg-success-700">
                  <MessageSquareText size={24}/>
                  Start chatting
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}