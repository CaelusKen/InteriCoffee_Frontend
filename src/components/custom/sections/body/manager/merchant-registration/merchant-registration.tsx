'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Info, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function MerchantRegistrationPage() {
  const merchants = [
    { id: "1", name: "Furniture Co.", phoneNumber: "123-456-7890", status: "Pending" },
    { id: "2", name: "Home Essentials", phoneNumber: "098-765-4321", status: "Pending" },
    { id: "3", name: "Comfort Living	", phoneNumber: "555-555-5555", status: "Pending" },
  ]

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 100 }}
      transition={{ duration: 0.75, delay: 0.25 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-6">Merchant Registration</h1>
      <div className="flex justify-between items-center">
        <Input className="max-w-sm" placeholder="Search merchants..." />
        {/* <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="mr-2 h-4 w-4" /> Add Merchant
        </Button> */}
      </div>
      <div className="shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-100 dark:bg-gray-600 divide-y divide-gray-200">
            {merchants.map((merchant) => (
              <tr key={merchant.id}>
                <td className="px-6 py-4 whitespace-nowrap">{merchant.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{merchant.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{merchant.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-default">
                    {merchant.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="bg-yellow-400 hover:bg-yellow-500 hover:text-white dark:bg-yellow-600 dark:hover:bg-yellow-800">
                      <Info className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                    <Button size="sm" variant="outline" className="bg-green-500 hover:bg-green-600 hover:text-white">
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="bg-red-500 hover:bg-red-600 hover:text-white">
                      <X className="h-4 w-4 mr-1" />
                      Deny
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