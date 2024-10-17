'use client'

import React from 'react'
import RecentStyleEditCard from '../cards/recent-style-edit'
import OrderTrackingTable from '../tables/customer/order-tracking-table'

const editorInfo = {
    name: 'Caelus',
    avatarUrl: 'https://github.com/shadcn.png'
}

const UserHome = () => {
  return (
    <section className='px-10 py-4'>
        <h1 className='text-6xl uppercase mb-2 font-semibold'>Welcome Back, Customer!</h1>
        <em className='text-xl'>Let's begin our journey here at InteriCoffee!</em>
        <div className='mt-10'>
            <h3 className='text-xl font-medium mb-2'>Continue from where you were left of</h3>
            <div className='grid sm:grid-cols-1 lg:grid-cols-3 gap-2 justify-items-center'>
                <RecentStyleEditCard
                    id='1' 
                    imageUrl='https://placeholder.co/400'
                    title='Your style'
                    description='Your current style'
                    editTime='13 minutes ago'
                    editor={editorInfo}
                    onViewDetails={() => {
                        // Handle view details action
                        console.log("View details clicked");
                    }}
                    onRemove={() => {
                        // Handle remove action
                        console.log("Design removed");
                    }}
                />
                <RecentStyleEditCard
                    id='2' 
                    imageUrl='https://placeholder.co/400'
                    title='Your style'
                    description='Your current style'
                    editTime='1 day(s) ago'
                    editor={editorInfo}
                    onViewDetails={() => {
                        // Handle view details action
                        console.log("View details clicked");
                    }}
                    onRemove={() => {
                        // Handle remove action
                        console.log("Design removed");
                    }}
                />
                <RecentStyleEditCard 
                    id='3'
                    imageUrl='https://placeholder.co/400'
                    title='Your style'
                    description='Your current style'
                    editTime='3 day(s) ago'
                    editor={editorInfo}
                    onViewDetails={() => {
                        // Handle view details action
                        console.log("View details clicked");
                    }}
                    onRemove={() => {
                        // Handle remove action
                        console.log("Design removed");
                    }}
                />
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