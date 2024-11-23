'use client'

import React from 'react'
import OrderTrackingTable from '../tables/customer/order-tracking-table'
import { useSession } from 'next-auth/react'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, APIDesign } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useQuery } from '@tanstack/react-query'

const fetchDesigns = async() : Promise<ApiResponse<PaginatedResponse<APIDesign>>> => {
    return api.getPaginated<APIDesign>(`designs`)
}

const UserHome = () => {
    const { data: session } = useSession()

    const accountQuery = useQuery({
        queryKey: ['account', session?.user.email],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Account>>(`accounts/${session?.user.email}/info`)
            return mapBackendToFrontend<Account>(response.data, 'account')
        }
    })

    const account = accountQuery.data

    const designsQuery = useQuery({
        queryKey: ['designs'],
        queryFn: () => fetchDesigns(),
    })

    const designs = designsQuery.data?.data.items.filter(item => item.accountId === account?.id)

    if (!accountQuery.isLoading &&!accountQuery.isSuccess) {
        return <div>Failed to load account data</div>
    }

    return (
        <section className='px-10 py-4'>
            <h1 className='text-6xl uppercase mb-2 font-semibold'>Welcome Back, {account?.userName}!</h1>
            <em className='text-xl'>Let's begin our journey here at InteriCoffee!</em>
            <div className='mt-10'>
                <h3 className='text-xl font-medium mb-2'>Continue from where you were left of</h3>
                <div className='grid sm:grid-cols-1 lg:grid-cols-3 gap-2 justify-items-center'>
                    {
                        designs?.map((design, index) => (
                            <div key={index} className='w-full'>
                                <h4 className='text-xl font-medium mb-2'>{design.name}</h4>
                                <p>{design.description}</p>
                                <p>Created: {design.createdDate.toLocaleDateString()}</p>
                            </div>
                        )) || <p>No designs found for this account.</p>
                    }
                </div>
            </div>
            <div className='mt-10'>
                <h3 className='text-xl font-medium'>Or track your orders</h3>
                <OrderTrackingTable />      
            </div>
        </section>
    )
}

export default UserHome