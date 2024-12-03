import { NextResponse } from 'next/server';
import { db } from '@/service/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;

  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('roomId', '==', roomId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const messagesSnapshot = await getDocs(q);
    
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(messages);
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}