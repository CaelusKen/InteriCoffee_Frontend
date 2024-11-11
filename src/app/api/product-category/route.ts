import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend, mapBackendListToFrontend } from "@/lib/entity-handling/handler";
import { ProductCategory } from '@/types/frontend/entities';
import { BackendProductCategory } from '@/types/backend/entities';

const entityHandlers = createEntityHandlers<BackendProductCategory>('product-categories');

export async function GET(request: NextRequest) {
  try {
    const response = await entityHandlers.getAll(request);
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.data) {
      const mappedData = mapBackendListToFrontend<ProductCategory>(data.data, 'product-categories');
      return NextResponse.json({ ...data, data: mappedData });
    }
    
    return response;
  } catch (error) {
    console.error('Error in product categories GET:', error);
    return NextResponse.json({ error: 'Failed to fetch product categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await entityHandlers.create(request);
    const data = await response.json();
    
    if (data.data) {
      const mappedData = mapBackendToFrontend<ProductCategory>(data.data, 'product-categories');
      return NextResponse.json({ ...data, data: mappedData });
    }
    
    return response;
  } catch (error) {
    console.error('Error in product categories POST:', error);
    return NextResponse.json({ error: 'Failed to create product category' }, { status: 500 });
  }
}