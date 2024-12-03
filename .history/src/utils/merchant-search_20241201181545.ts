import { api } from '@/service/api';
import { mapBackendListToFrontend } from '@/lib/entity-handling/handler';

// Define the Merchant type (replace with your actual type)
type Merchant = {
  id: number;
  name: string;
  // ... other properties
};

export async function searchMerchants(query: string, page: number = 1, pageSize: number = 10) {
  try {
    const response = await api.getPaginated<Merchant>('merchants', { 
      page, 
      pageSize,
      query, // Add this line to include the query parameter
    })
    return mapBackendListToFrontend<Merchant>(response.data, 'merchants')
  } catch (error) {
    console.error('Error searching merchants:', error)
    return { items: [], totalCount: 0, pageNumber: page, pageSize }
  }
}

//Example usage
async function test(){
    const merchants = await searchMerchants("test",1,10);
    console.log(merchants);
}

test();