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
  try {
    const body = await request.json();
    console.log('Received PATCH request for account update with data:', body);
    
    // Ensure the ID in the URL matches the ID in the body
    if (params.id !== body.id) {
      return NextResponse.json({ error: 'ID mismatch' }, { status: 400 });
    }

    const response = await accountHandlers.update(request, { params });
    const data = await response.json();
    
    if (data.data) {
      const mappedData = mapBackendToFrontend<Account>(data.data, 'account');
      console.log('Mapped PATCH response:', mappedData);
      return NextResponse.json({ ...data, data: mappedData });
    }
    
    if (data.errors) {
      console.error('Validation errors:', data.errors);
      return NextResponse.json({ errors: data.errors }, { status: 400 });
    }
    
    return response;
  } catch(error) {
    console.error('Error in PATCH method:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return accountHandlers.delete(request, { params });
}