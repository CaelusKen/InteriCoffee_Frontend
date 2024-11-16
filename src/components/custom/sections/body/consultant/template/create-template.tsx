"use client"

import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Product, ProductCategory, Style, Template } from '@/types/frontend/entities'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Documentation } from './create-template/documentation'
import { SketchPhase } from './create-template/sketch-phase'

const fetchAllProduct = async({ pageNo = 1, pageSize = 10 }): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>('products', { pageNo, pageSize })
}

const fetchAccountByEmail = async(email: string): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`)
}

const fetchStyles =  async({ pageNo = 1, pageSize = 10 }): Promise<ApiResponse<PaginatedResponse<Style>>> => {
  return api.getPaginated<Style>('styles', { pageNo, pageSize })
}

export default function ConsultantCreateTemplate() {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { data: session } = useSession()
  const [account, setAccount] = useState<Account | null>(null)
  const { toast } = useToast()
  const [phase, setPhase] = useState<'documentation' | 'sketch'>('documentation')
  const [templateData, setTemplateData] = useState(null)

  const router = useRouter()

  const productsQuery = useQuery({
    queryKey: ['products', pageNo, pageSize],
    queryFn: () => fetchAllProduct({ pageNo, pageSize })
  })

  const stylesQuery = useQuery({
    queryKey: ['styles', pageNo, pageSize],
    queryFn: () => fetchStyles({ pageNo, pageSize })
  })

  useEffect(() => {
    if (session?.user?.email) {
      fetchAccountByEmail(session.user.email)
        .then((res) => {
          const mappedAccount = mapBackendToFrontend<Account>(res.data, 'account')
          setAccount(mappedAccount)
        }).catch((error) => {
          toast({
            title: 'Error',
            description: `Error in load account: ${error}`,
            variant: 'destructive'
          })
        })
    }
  }, [session, toast])

  const products = productsQuery.data?.data.items ?? []
  const styles = stylesQuery.data?.data.items ?? []

  const handleProceed = () => {
    setPhase('sketch')
  }

  const handleSave = (data: any) => {
    setTemplateData(data)
    api.post<Template>('templates', {
      "account-id": account?.id,
      "merchant-id": account?.merchantId,
      name: data.name,
      description: data.description,
      "style-id": data.styleId,
      image: data.imageUrl,
      floors: null,
      type: "Sketch",
      categories: data.categories,
    })
      .then((res) => {
        if (res.data != null && res.status == 200) {
          toast({
            title: 'Success',
            description: `Template created successfully`,
          })
          router.push('/consultant/templates')
        }
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: `${err}. Check the network for details`,
          variant: 'destructive'
        })
      })
  }

  if (!account) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      {phase === 'documentation' ? (
        <Documentation onProceed={handleProceed} />
      ) : (
        <SketchPhase account={account} products={products} styles={styles} onSave={handleSave} />
      )}
    </div>
  )
}