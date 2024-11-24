'use client'

import React from 'react'
import OrderTrackingTable from '../tables/customer/order-tracking-table'
import { useSession } from 'next-auth/react'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, APIDesign } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { useQuery } from '@tanstack/react-query'
import { useAccessToken } from '@/hooks/use-access-token'
import CustomerDesignCard from '../cards/customer-design-card'

const fetchDesigns = async(accessToken: string) : Promise<ApiResponse<PaginatedResponse<APIDesign>>> => {
    try {
        const response = await api.getPaginated<APIDesign>(`designs`, undefined, accessToken);
        console.log('API Response:', response); // Log the response
        return response;
    } catch (error) {
        console.error('Error fetching designs:', error);
        throw error;
    }
}

const UserHome = () => {
    const { data: session } = useSession()

    const accessToken = useAccessToken()

    const accountQuery = useQuery({
        queryKey: ['account', session?.user.email],
        queryFn: async () => {
            const response = await api.get<ApiResponse<Account>>(`accounts/${session?.user.email}/info`)
            return mapBackendToFrontend<Account>(response.data, 'account')
        }
    })

    const account = accountQuery.data

    const designsQuery = useQuery({
        queryKey: ['designs', accessToken],
        queryFn: () => {
            if (!accessToken) {
                throw new Error('Access token is missing');
            }
            return fetchDesigns(accessToken);
        },
        enabled: !!accessToken, // Only run the query when accessToken is available
    })

    const designs = designsQuery.data?.data.items.filter(item => item.accountId === account?.id).sort((a, b) => b.updateDate.getTime() - a.updateDate.getTime()).slice(0, 4)

    if (!accountQuery.isLoading &&!accountQuery.isSuccess) {
        return <div>Failed to load account data</div>
    }

    if (designsQuery.isError) {
        console.error('Error fetching designs:', designsQuery.error);
        return <div>Failed to load designs</div>;
    }
    
    if (designsQuery.isLoading) {
        return <div>Loading designs...</div>;
    }

    return (
        <section className='px-10 py-4'>
            <h1 className='text-6xl uppercase mb-2 font-semibold'>Welcome Back, {account?.userName}!</h1>
            <em className='text-xl'>Let's begin our journey here at InteriCoffee!</em>
            <div className='mt-10'>
                <h3 className='text-xl font-medium mb-2'>Continue from where you were left of</h3>
                <div className='grid sm:grid-cols-1 lg:grid-cols-4 gap-2 justify-items-center'>
                    {
                        designs?.map((design) => (
                            <CustomerDesignCard key={design.id} design={design} />
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