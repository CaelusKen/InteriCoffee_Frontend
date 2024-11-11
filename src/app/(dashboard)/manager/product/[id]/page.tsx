import { Suspense } from 'react'
import { ProductDetails } from '@/components/custom/sections/body/merchant/products/product-details'

export default function ViewProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails productId={params.id} />
    </Suspense>
  )
}