import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend, mapBackendListToFrontend } from "@/lib/entity-handling/handler";
import { Order } from '@/types/frontend/entities';
import { BackendOrder } from '@/types/backend/entities';

const entityHandlers = createEntityHandlers<BackendOrder>('orders');

export async function GET(request: NextRequest) {
  const response = await entityHandlers.getAll(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendListToFrontend<Order>(data.data, 'order');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = await entityHandlers.create(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<Order>(data.data, 'order');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}