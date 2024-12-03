import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (url: string, path: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(url, { path });

    socketIo.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socketIo.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url, path]);

  return socket;
};