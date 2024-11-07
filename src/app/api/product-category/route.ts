import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend, mapBackendListToFrontend } from "@/lib/entity-handling/handler";
import { ProductCategory } from '@/types/frontend/entities';
import { BackendProductCategory } from '@/types/backend/entities';

const entityHandlers = createEntityHandlers<BackendProductCategory>('product-categories');

export async function GET(request: NextRequest) {
  const response = await entityHandlers.getAll(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendListToFrontend<ProductCategory>(data.data, 'productCategory');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = await entityHandlers.create(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<ProductCategory>(data.data, 'productCategory');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}