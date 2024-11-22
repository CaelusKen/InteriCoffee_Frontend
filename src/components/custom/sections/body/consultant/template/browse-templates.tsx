'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { TemplateData } from '@/types/room-editor'
import { Button } from '@/components/ui/button'
import { Plus, PlusCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import ConsultantTemplateCard from '@/components/custom/cards/consultant-template-card'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import LoadingPage from '@/components/custom/loading/loading'
import { motion } from 'framer-motion'
import { useAccessToken } from '@/hooks/use-access-token'

const fetchTemplates = ({pageNo = 1, pageSize = 10}, accessToken: string) : Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>('templates', { pageNo, pageSize }, accessToken)
}

const fetchAccountByEmail = async(email: string, accessToken: string): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`, undefined, accessToken)
}

const ConsultantBrowseTemplatePage = () => {
  const accessToken = useAccessToken()

  const [pageNo, setPageNo] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [account, setAccount] = useState<Account | null>(null)

  const { data: session } = useSession()

  const router = useRouter();
  
  const templatesQuery = useQuery({
    queryKey: ['templates'],
    queryFn: () => fetchTemplates({pageNo, pageSize}, accessToken ?? '')
  })

  const templatesList = templatesQuery.data?.data.items ?? []

  useEffect(() => {
    if (session?.user?.email) {
      fetchAccountByEmail(session.user.email, accessToken ?? '')
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

  const consultantTemplates = templatesList.filter((template) => template.accountId === account?.id)

  const handleCreateTemplate = () => {
    router.push('/consultant/templates/create');
  }

  const handleViewTemplateDetails = (id: string) => {
    router.push(`/consultant/templates/${id}`);
  }

  const handleEditTemplateDetails = (id: string) => {
    router.push(`/consultant/templates/edit/${id}`);
  }
  
  return (
    <section className='py-4'>
      <div className='flex itemscenter justify-between'>
        <h1 className='font-bold uppercase text-2xl'>Your template designs</h1>
        <Button className='bg-green-500 hover:bg-green-600' onClick={() => handleCreateTemplate()}>
          <span className='flex gap-2'>
            <PlusCircle size={24}/>
            <p>Create a Template</p>
          </span>
        </Button>
      </div>
      <Suspense fallback={<LoadingPage />}>
        <section className='flex flex-col gap-4 mt-4'>
            {consultantTemplates.map((template, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 100 }}
                  transition={{ duration: 1, delay: 0.2 * index}}
                >
                  <ConsultantTemplateCard key={index} {...template} />
                </motion.div>
            ))}
        </section>
      </Suspense>
    </section>
  )
}

export default ConsultantBrowseTemplatePage