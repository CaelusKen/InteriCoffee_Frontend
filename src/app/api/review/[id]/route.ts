import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { Review } from '@/types/frontend/entities';
import { BackendReview } from '@/types/backend/entities';

const entityHandlers = createEntityHandlers<BackendReview>('reviews');

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const response = await entityHandlers.getById(request, { params });
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<Review>(data.data, 'review');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const response = await entityHandlers.update(request, { params });
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<Review>(data.data, 'review');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return entityHandlers.delete(request, { params });
}