"use client"

import { api } from '@/service/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Account, APIDesign } from '@/types/frontend/entities'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React from 'react'
import CustomerDesignCard from '../../cards/customer-design-card'
import { mapBackendToFrontend } from '@/lib/entity-handling/handler'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const fetchDesigns = async(): Promise<ApiResponse<PaginatedResponse<APIDesign>>> => {
  return api.getPaginated<APIDesign>('designs')
}

const CustomerBrowseDesigns = () => {
  const { data: session } = useSession()

  //For searching results
  const [searchTerm, setSearchTerm] = React.useState('')

  const accountQuery = useQuery({
    queryKey: ["account", session?.user.email],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Account>>(
        `accounts/${session?.user.email}/info`
      );
      return mapBackendToFrontend<Account>(response.data, "account");
    },
  });

  const account = accountQuery.data;

  const designQuery = useQuery({
    queryKey: ['designs'],
    queryFn: fetchDesigns,
    enabled:!!session?.user?.email,
  })

  //Search functionality
  const handleSearch = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSearchTerm(event.target.value)
  }

  const accountDesigns = designQuery.data?.data.items
                          .filter((design) => design.accountId === account?.id)
                          .sort((a, b) => b.updateDate.getTime() - a.updateDate.getTime()) ?? []

  const searchDesigns = accountDesigns.filter((design) =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  //For pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [designPerPage] = React.useState(8)
  const indexOfLastDesign = currentPage * designPerPage
  const indexOfFirstDesign = indexOfLastDesign - designPerPage
  const currentDesigns = searchDesigns.slice(indexOfFirstDesign, indexOfLastDesign)

  if (!account) {
    return null
  }

  return (
    <section className='p-10'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold'>Browse through your designs here</h1>
        <Button className='bg-green-500 hover:bg-green-600'>
          <Plus />
          Add New Design
        </Button>
      </div>
      <div className='my-4'>
        <Label htmlFor='Search'>Search Design</Label>
        <Input 
          type='text'
          id='Search'
          value={searchTerm}
          onChange={handleSearch}
          className='w-full pl-4 pr-12 border border-gray-300 rounded-md'
          style={{ WebkitTextFillColor: 'black', opacity: 1 }}
          placeholder='Search for designs...'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {currentDesigns.map((design) => (
          <CustomerDesignCard key={design.id} design={design} />
        ))}
      </div>
      <div className='flex justify-center items-center gap-8 mt-8'>
        <Button
          variant={'secondary'}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous 
        </Button>
        <span>Page {currentPage} of {Math.ceil(accountDesigns.length / designPerPage)}</span>
        <Button
          variant={'secondary'}
          disabled={currentPage === Math.ceil(accountDesigns.length / designPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}

export default CustomerBrowseDesigns