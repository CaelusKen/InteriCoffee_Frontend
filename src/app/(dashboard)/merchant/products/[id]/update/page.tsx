import { Suspense } from 'react'
import { MerchantUpdateProductForm } from '@/components/custom/sections/body/merchant/products/update-product'
import LoadingPage from '@/components/custom/loading/loading'

export default function MerchantUpdateProduct({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <MerchantUpdateProductForm productId={params.id} />
    </Suspense>
  )
}
