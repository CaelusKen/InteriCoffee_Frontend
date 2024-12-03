import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChatRoom } from '@/types/chat';

function ChatRoomList() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchChatRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/chat-rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms');
      }
      const rooms = await response.json();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setError('Failed to load chat rooms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchChatRooms();
    }
  }, [session]);

  if (isLoading) {
    return <div>Loading chat rooms...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session) {
    return <div>Please sign in to access the chat.</div>;
  }

  return (
    <ul>
      {chatRooms.map((room) => (
        <li key={room.id}>{room.name}</li>
      ))}
    </ul>
  );
}

export default ChatRoomList;