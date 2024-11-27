'use client'

import React from 'react'
import { useAccessToken } from '@/hooks/use-access-token'
import { api } from '@/service/api'
import { ApiResponse } from '@/types/api'
import { Account } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MailIcon, PhoneIcon, MapPinIcon, BuildingIcon, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AccountDetailsProps {
  id: string
}

const fetchAccountById = async (id: string, accessToken: string): Promise<ApiResponse<Account>> => {
  return api.getById('accounts', id, accessToken)
}

export default function ManagerAccountDetails({ id }: AccountDetailsProps) {
  const accessToken = useAccessToken()

  const router = useRouter()

  const accountQuery = useQuery({
    queryKey: ['account', id],
    queryFn: () => fetchAccountById(id, accessToken ?? ''),
    enabled: !!accessToken,
    refetchInterval: 60000, // Fetch every 60 seconds
    staleTime: 120000, // Cache for 2 minutes
  })

  const account = accountQuery.data?.data

  if (accountQuery.isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (accountQuery.error) {
    return <div className="text-red-500">Error: {(accountQuery.error as Error).message}</div>
  }

  if (!account) {
    return <div>No account data found</div>
  }

  return (
    <div className="container mx-auto py-2">
      <Button variant={'link'} className='p-0' onClick={() => router.push("/manager/accounts")}>
        <ArrowLeft/>
        Back
      </Button>
      <h1 className="text-3xl font-bold">Account Details</h1>
      <Card className="max-w-full mx-auto my-4">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={account.avatar} alt={account.userName} />
            <AvatarFallback>{account.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{account.userName}</CardTitle>
            <Badge variant={account.status === 'Active' ? 'default' : 'secondary'}>
              {account.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <dt className="sr-only">Email</dt>
              <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
              <dd>{account.email}</dd>
            </div>
            <div className="flex items-center">
              <dt className="sr-only">Phone Number</dt>
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <dd>{account.phoneNumber}</dd>
            </div>
            <div className="flex items-center">
              <dt className="sr-only">Address</dt>
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <dd>{account.address}</dd>
            </div>
            <div className="flex items-center">
              <dt className="sr-only">Role</dt>
              <BuildingIcon className="h-5 w-5 text-gray-400 mr-2" />
              <dd className="capitalize">{account.role}</dd>
            </div>
            <div className="flex items-center">
              <dt className="sr-only">Created Date</dt>
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <dd>{new Date(account.createdDate).toLocaleDateString()}</dd>
            </div>
            <div className="flex items-center">
              <dt className="sr-only">Updated Date</dt>
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <dd>{new Date(account.updatedDate).toLocaleDateString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}