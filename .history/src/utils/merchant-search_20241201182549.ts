import { api } from '@/service/api';
import { mapBackendListToFrontend } from '@/lib/entity-handling/handler';
import { Merchant } from '@/types/frontend/entities';

export async function searchMerchants(keyword: string ,page: number = 1, pageSize: number = 10) {
  try {
    const response = await api.getPaginated<Merchant>('merchants', { 
      page, 
      pageSize,
      "keyword": keyword,
    })
    return mapBackendListToFrontend<Merchant>(response.data, 'merchants')
  } catch (error) {
    console.error('Error searching merchants:', error)
    return { items: [], totalCount: 0, pageNumber: page, pageSize }
  }
}

