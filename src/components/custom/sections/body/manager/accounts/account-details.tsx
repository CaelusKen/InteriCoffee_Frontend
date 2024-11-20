'use client'

import React from 'react'
import { useAccessToken } from '@/hooks/use-access-token';
import { api } from '@/service/api';
import { ApiResponse } from '@/types/api';
import { Account } from '@/types/frontend/entities';
import { useQuery } from '@tanstack/react-query';

interface AccountDetailsProps {
    id: string;
}

const fetchAccountById = async(id: string, accessToken: string): Promise<ApiResponse<Account>> => {
    return api.getById('accounts', id, accessToken)
}

export default function ManagerAccountDetails({id}: AccountDetailsProps) {
    const accessToken = useAccessToken();

    const accountQuery = useQuery({
        queryKey: ['account', id],
        queryFn: () => fetchAccountById(id, accessToken ?? ''),
        enabled: !!accessToken,
        refetchInterval: 60000, // Fetch every 60 seconds
        staleTime: 120000, // Cache for 2 minutes
    })

    const account = accountQuery.data?.data

    return (
        <section>
            <h1>Account Details</h1>
            {account && (
                <div>
                    <h2>Account ID: {account.id}</h2>
                    <p>Name: {account.userName}</p>
                    <p>Email: {account.email}</p>
                    <p>Phone Number: {account.phoneNumber}</p>
                </div>
            )}
            {accountQuery.isLoading && <p>Loading...</p>}
            {accountQuery.error && <p>Error: {(accountQuery.error as Error).message}</p>}
        </section>
    )
}