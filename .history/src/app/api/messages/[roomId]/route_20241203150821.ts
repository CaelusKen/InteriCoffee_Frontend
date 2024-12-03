import { NextResponse } from 'next/server';
import { storage } from '@/service/firebase';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = params;

  try {
    // Reference to the specific chat room directory in Storage
    const roomRef = ref(storage, `chat-files/${roomId}`);
    
    // List all message files in the room directory
    const result = await listAll(roomRef);
    
    // Get metadata and download URLs for each message file
    const messages = await Promise.all(
      result.items.map(async (itemRef) => {
        try {
          const [metadata, downloadURL] = await Promise.all([
            getMetadata(itemRef),
            getDownloadURL(itemRef)
          ]);

          // Parse the message data from metadata
          const messageData = metadata.customMetadata || {};
          
          return {
            id: itemRef.name,
            content: messageData.content,
            sender: {
              id: messageData.senderId,
              name: messageData.senderName
            },
            timestamp: metadata.timeCreated,
            downloadURL,
            roomId
          };
        } catch (error) {
          console.error(`Error getting message data for ${itemRef.name}:`, error);
          return null;
        }
      })
    );

    // Filter out any null values from failed message retrievals
    const validMessages = messages.filter(Boolean);
    
    // Sort messages by timestamp
    validMessages.sort((a, b) => 
      new Date(a!.timestamp).getTime() - new Date(b!.timestamp).getTime()
    );

    return NextResponse.json(validMessages);
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}