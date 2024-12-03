import { NextResponse } from 'next/server';
import { storage } from '@/service/firebase';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';

export async function GET() {
  try {
    // Reference to the chat-files directory in Storage
    const chatRoomsRef = ref(storage, 'chats/chat-files');
    
    // List all items (folders) in the chat-files directory
    const result = await listAll(chatRoomsRef);
    
    // Get metadata for each chat room folder
    const chatRooms = await Promise.all(
      result.prefixes.map(async (folderRef) => {
        try {
          const metadata = await getMetadata(folderRef);
          return {
            id: folderRef.name,
            name: metadata.customMetadata?.name || folderRef.name,
            createdAt: metadata.timeCreated,
            updatedAt: metadata.updated
          };
        } catch (error) {
          console.error(`Error getting metadata for ${folderRef.name}:`, error);
          return {
            id: folderRef.name,
            name: folderRef.name
          };
        }
      })
    );

    return NextResponse.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 });
  }
}