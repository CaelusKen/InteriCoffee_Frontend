import ProductDetails from '@/components/custom/sections/body/manager/products/product-details'
import { Suspense } from 'react'


export default function ViewProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails productId={params.id} />
    </Suspense>
  )
}