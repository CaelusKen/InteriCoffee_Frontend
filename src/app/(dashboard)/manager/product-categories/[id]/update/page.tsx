import React, { Suspense } from 'react'
import LoadingPage from '@/components/custom/loading/loading'
import UpdateProductCategoryForm from '@/components/custom/sections/body/merchant/product-categories/update-product-category'

export default function UpdateProductCategory({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingPage />}>
        <UpdateProductCategoryForm categoryId={params.id}/>    
    </Suspense>
  )
}
