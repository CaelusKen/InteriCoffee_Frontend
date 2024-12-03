import { NextResponse } from 'next/server';
import { db } from '@/service/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const chatRoomsRef = collection(db, 'chatRooms');
    const chatRoomsSnapshot = await getDocs(chatRoomsRef);
    
    const chatRooms = chatRoomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 });
  }
}

