import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend, mapBackendListToFrontend } from "@/lib/entity-handling/handler";
import { Account } from '@/types/frontend/entities';
import { BackendAccount } from '@/types/backend/entities';

const accountHandlers = createEntityHandlers<BackendAccount>('accounts');

export async function GET(request: NextRequest) {
  const response = await accountHandlers.getAll(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendListToFrontend<Account>(data.data, 'account');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = await accountHandlers.create(request);
  const data = await response.json();
  
  if (data.data) {
    const mappedData = mapBackendToFrontend<Account>(data.data, 'account');
    return NextResponse.json({ ...data, data: mappedData });
  }
  
  return response;
}