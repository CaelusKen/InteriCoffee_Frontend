import { api } from '@/service/api'
import { Merchant } from '@/types/frontend/entities'
import { mapBackendListToFrontend } from '@/lib/entity-handling/handler'

export async function searchMerchants(query: string, page: number = 1, pageSize: number = 10) {
  try {
    const response = await api.getPaginated<Merchant>('merchants', { 
      page, 
      pageSize,
    })
    console.log(mapBackendListToFrontend<Merchant>(response.data, 'merchants'));
    return mapBackendListToFrontend<Merchant>(response.data, 'merchants')
  } catch (error) {
    console.error('Error searching merchants:', error)
    return { items: [], totalCount: 0, pageNumber: page, pageSize }
  }
}

