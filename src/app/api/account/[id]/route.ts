import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { Account } from '@/types/frontend/entities';
import { BackendAccount } from '@/types/backend/entities';

const accountHandlers = createEntityHandlers<BackendAccount>('accounts');

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const response = await accountHandlers.getById(request, { params });
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<Account>(data.data, 'account');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const response = await accountHandlers.update(request, { params });
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<Account>(data.data, 'account');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return accountHandlers.delete(request, { params });
}