import { ref, set, push, onValue, off } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { realtimeDb, storage } from '@/service/firebase';
import { v4 as uuidv4 } from 'uuid';
import { api } from '@/service/api';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
}

export interface ChatSession {
  id: string;
  participantId: string;
  lastMessage: string;
  updatedAt: string;
}

const sanitizeEmail = (email: string): string => {
  return email.replace(/[.#$[\]]/g, '_');
};

export const firebaseChat = {
  createOrUpdateSession: async (email: string, participantId: string, message: string) => {
    console.log('Creating or updating session:', { email, participantId, message });
    const sanitizedEmail = sanitizeEmail(email);
    const sessionId = `${sanitizedEmail}_${participantId}`;
    const sessionRef = ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}`);
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: email,
      content: message,
      timestamp: new Date().toISOString(),
    };

    await set(sessionRef, {
      id: sessionId,
      participantId,
      lastMessage: message,
      updatedAt: newMessage.timestamp,
    });

    const messagesRef = ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}/messages`);
    await push(messagesRef, newMessage);

    console.log('Session created/updated:', sessionId);
    return sessionId;
  },

  sendMessage: async (email: string, sessionId: string, message: string, file?: File) => {
    const sanitizedEmail = sanitizeEmail(email);
    const chatRef = ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}/messages`);
    let fileUrl = '';

    if (file) {
      const fileRef = storageRef(storage, `chat-files/${sanitizedEmail}/${sessionId}/${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: email,
      content: message,
      timestamp: new Date().toISOString(),
      fileUrl,
    };

    await push(chatRef, newMessage);

    //Backup to API
    await api.post<ChatSession>('chat-sessions', newMessage).then((res) => {
      if (res.status === 200) {
        console.log('API backup successful:', res.data);
      }
      else {
        console.error('API backup failed:', res.message);
      }
    })

    await set(ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}`), {
      lastMessage: message,
      updatedAt: newMessage.timestamp,
    });
    console.log('Message sent');
  },

  listenToSessions: (email: string, callback: (sessions: ChatSession[]) => void) => {
    console.log('Setting up session listener for:', email);
    const sanitizedEmail = sanitizeEmail(email);
    const sessionsRef = ref(realtimeDb, `chats/${sanitizedEmail}`);
    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter out the 'messages' key and only process session data
        const sessions = Object.entries(data).map(([id, session]: [string, any]) => ({
          id,
          participantId: session.participantId,
          lastMessage: session.lastMessage,
          updatedAt: session.updatedAt,
        }));
        console.log('Processed sessions:', sessions);
        callback(sessions);
      } else {
        console.log('No sessions found');
        callback([]);
      }
    });

    return () => off(sessionsRef);
  },

  listenToMessages: (email: string, sessionId: string, callback: (messages: ChatMessage[]) => void) => {
    console.log('Setting up message listener for:', { email, sessionId });
    const sanitizedEmail = sanitizeEmail(email);
    const messagesRef = ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.values(data) as ChatMessage[];
        console.log('Received messages:', messages);
        callback(messages);
      } else {
        console.log('No messages found');
        callback([]);
      }
    });

    return () => off(messagesRef);
  },
};