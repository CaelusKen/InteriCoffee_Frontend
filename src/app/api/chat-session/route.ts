import { NextRequest, NextResponse } from 'next/server';
import { createEntityHandlers } from '@/lib/api-handler';
import { mapBackendToFrontend, mapBackendListToFrontend } from "@/lib/entity-handling/handler";
import { ChatSession } from '@/types/frontend/entities';
import { BackendChatSession } from '@/types/backend/entities';

const entityHandlers = createEntityHandlers<BackendChatSession>('chat-sessions');

export async function GET(request: NextRequest) {
  try {
    const response = await entityHandlers.getAll(request);
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.data) {
      const mappedData = mapBackendListToFrontend<ChatSession>(data.data, 'chat-sessions');
      return NextResponse.json({ ...data, data: mappedData });
    }
    
    return response;
  } catch (error) {
    console.error('Error in chat session GET:', error);
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await entityHandlers.create(request);
    const data = await response.json();
    
    if (data.data) {
      const mappedData = mapBackendToFrontend<ChatSession>(data.data, 'chat-sessions');
      return NextResponse.json({ ...data, data: mappedData });
    }
    
    return response;
  } catch (error) {
    console.error('Error in chat session POST:', error);
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
}