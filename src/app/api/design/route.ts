import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend, mapBackendListToFrontend } from "@/lib/entity-handling/handler";
import { APIDesign } from '@/types/frontend/entities';
import { BackendDesign } from '@/types/backend/entities';

const entityHandlers = createEntityHandlers<BackendDesign>('designs');

export async function GET(request: NextRequest) {
  const response = await entityHandlers.getAll(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendListToFrontend<APIDesign>(data.data, 'design');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = await entityHandlers.create(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<APIDesign>(data.data, 'design');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}