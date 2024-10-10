'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilePen, Info, Plus, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function AccountPage() {
  const accounts = [
    { name: "John Doe", email: "john@example.com", phoneNum: "123-456-7890", role: "Merchant", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", phoneNum: "098-765-4321", role: "Customer", status: "Inactive" },
    { name: "Bob Johnson", email: "bob@example.com", phoneNum: "555-555-5555", role: "Merchant", status: "Active" },
  ]

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 100 }}
      transition={{ duration: 0.75, delay: 0.25 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-6">Accounts</h1>
      <div className="flex justify-between items-center">
        <Input className="max-w-sm" placeholder="Search accounts..." />
        {/* <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="mr-2 h-4 w-4" /> Add Account
        </Button> */}
      </div>
      <div className="shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-100 dark:bg-gray-600 divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.email}>
                <td className="px-6 py-4 whitespace-nowrap">{account.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.phoneNum}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    account.status === 'Active' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  } cursor-default`}>
                    {account.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="bg-yellow-400 hover:bg-yellow-500 hover:text-white dark:bg-yellow-600 dark:hover:bg-yellow-800">
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="bg-orange-400 hover:bg-orange-500 hover:text-white">
                      <FilePen className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                    <Button size="sm" variant="outline" className="bg-red-500 hover:bg-red-600 hover:text-white">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}