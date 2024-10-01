'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FilePen, Info, Plus, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function ProductHome()  {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0}}
      animate={{ x: 0, opacity: 100}}
      transition={{ duration: 0.75, delay: 0.25}}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-6">Product List</h1>
      <div className="flex justify-between items-center">
        <Input className="max-w-sm" placeholder="Search products..." />
        <Button className='bg-green-500 hover:bg-green-600'>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      <div className="shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 rounded-t-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-100 dark:bg-gray-600 divide-y divide-gray-200">
            {["Chair", "Table", "Sofa"].map((product) => (
              <tr key={product}>
                <td className="px-6 py-4 whitespace-nowrap">{product}</td>
                <td className="px-6 py-4 whitespace-nowrap">100</td>
                <td className="px-6 py-4 whitespace-nowrap">100</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 hover:bg-green-200 text-green-800 hover:text-green-800 cursor-default">
                    In Stock
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                  <Button className='bg-yellow-400 hover:bg-yellow-500 hover:text-white dark:bg-yellow-600 dark:hover:bg-yellow-800'>
                    <span className='flex items-center gap-4'>
                      <Info size={16} />
                      <p>Details</p>
                    </span>
                  </Button>
                  <Button className='bg-orange-400 hover:bg-orange-500 hover:text-white'>
                    <span className='flex items-center gap-4'>
                      <FilePen size={16}/>
                      <p>Update</p>
                    </span>
                  </Button>
                  <Button className='bg-red-500 hover:bg-red-600 hover:text-white'>
                    <span className='flex items-center gap-4'>
                      <Trash size={16}/>
                      <p>Delete</p>
                    </span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
