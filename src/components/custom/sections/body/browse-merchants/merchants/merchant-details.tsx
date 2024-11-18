import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WebsitePreviewCard from './merchant-website'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Merchant, Product, Template } from '@/types/frontend/entities'
import { api } from '@/service/api'
import { useQuery } from '@tanstack/react-query'
import FurnitureProductCard from '@/components/custom/cards/furniture-card-v2'
import TemplateCard from '@/components/custom/cards/default-template-card'
import { useRouter } from 'next/navigation'
import LoadingPage from '@/components/custom/loading/loading'

const fetchMerchantById = async(id: string): Promise<ApiResponse<Merchant>> => {
  return api.getById<Merchant>('merchants', id)
}

const fetchProducts = async(): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>('products')
}

const fetchTemplates = async(): Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>('templates')
}

interface MerchantProfileCardProps {
  id: string
}

export default function MerchantProfile({id} : MerchantProfileCardProps) {
  const merchantQuery = useQuery({
    queryKey: ['merchant', id],
    queryFn: () => fetchMerchantById(id),
    enabled:!!id
  })

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  })

  const templatesQuery = useQuery({
    queryKey: ['templates'],
    queryFn: () => fetchTemplates(),
  })

  const router = useRouter()

  const merchant = merchantQuery.data?.data

  const products = productsQuery.data?.data.items || []

  const templates = templatesQuery.data?.data.items || []

  const merchantProducts = products
    .filter((product) => product.merchantId === merchant?.id)
    .sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateB.getTime() - dateA.getTime();
    });

  const merchantTemplates = templates
    .filter((template) => template.merchantId === merchant?.id)
    .sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateB.getTime() - dateA.getTime();
    }).slice(0,2);

  if (!merchant ||!productsQuery.data) return <LoadingPage/>

  return (
    <div className='p-8'>
      <div className="w-full flex gap-4">
        <Card className='w-1/3'>
          <div className='flex justify-between pr-6'>
            <CardHeader>
              <CardTitle>{merchant?.name}</CardTitle>
            </CardHeader>
            <Link href={`/messages/${merchant?.id}`} passHref>
                <Button className="mt-4">Contact</Button>
            </Link>
          </div>
          <CardContent>
            <p className="text-muted-foreground">{merchant?.description || `Merchant ${merchant?.name}`}</p>
            
            <WebsitePreviewCard url={merchant?.website || ''}/>
          </CardContent>
        </Card>
        <Card className='w-2/3'>
          <CardHeader>
            <CardTitle>Recent Designs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center'>
              {merchantTemplates.map((template, index) => (
                <TemplateCard key={index} template={template} onSave={() => {}}/>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className='w-full mt-4'>
        <CardHeader>
          <CardTitle>Merchant Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {merchantProducts.map((product) => (
              <div key={product.id} className="space-y-4">
                  <FurnitureProductCard 
                    id={product.id}
                    name={product.name}
                    images={product.images.normalImages}
                    merchant={merchant?.id}
                    modelUrl={product.modelTextureUrl}
                    price={product.truePrice}
                  />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}