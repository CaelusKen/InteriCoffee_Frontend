import { ref, set, push, onValue, off } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { realtimeDb, storage } from '@/service/firebase';
import { v4 as uuidv4 } from 'uuid';

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
      messages: [newMessage],
    });

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
    await set(ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}`), {
      lastMessage: message,
      updatedAt: newMessage.timestamp,
    });
  },

  listenToSessions: (email: string, callback: (sessions: ChatSession[]) => void) => {
    const sanitizedEmail = sanitizeEmail(email);
    const sessionsRef = ref(realtimeDb, `chats/${sanitizedEmail}`);
    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessions = Object.values(data) as ChatSession[];
        callback(sessions);
      } else {
        callback([]);
      }
    });

    return () => off(sessionsRef);
  },

  listenToMessages: (email: string, sessionId: string, callback: (messages: ChatMessage[]) => void) => {
    const sanitizedEmail = sanitizeEmail(email);
    const messagesRef = ref(realtimeDb, `chats/${sanitizedEmail}/${sessionId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.values(data) as ChatMessage[];
        callback(messages);
      } else {
        callback([]);
      }
    });

    return () => off(messagesRef);
  },
};

