'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilePen, Info, Plus, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function OrderPage() {
  const orders = [
    { id: "1", createdAt: "2023-06-15", price: 150.99, status: "Pending" },
    { id: "2", createdAt: "2023-06-14", price: 89.50, status: "Shipped" },
    { id: "3", createdAt: "2023-06-13", price: 299.99, status: "Delivered" },
  ]

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 100 }}
      transition={{ duration: 0.75, delay: 0.25 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="flex justify-between items-center">
        <Input className="max-w-sm" placeholder="Search orders..." />
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="mr-2 h-4 w-4" /> Add Order
        </Button>
      </div>
      <div className="shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-100 dark:bg-gray-600 divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">${order.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  } cursor-default`}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="bg-yellow-400 hover:bg-yellow-500 hover:text-white dark:bg-yellow-600 dark:hover:bg-yellow-800">
                      <Info className="h-4 w-4 mr-1" />
                      Details
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