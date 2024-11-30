import { ref, set, push, onValue, off } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/service/firebase';
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

export const firebaseChat = {
  createOrUpdateSession: async (username: string, participantId: string, message: string) => {
    const sessionId = `${username}_${participantId}`;
    const sessionRef = ref(db, `chats/${username}/${sessionId}`);
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: username,
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

  sendMessage: async (username: string, sessionId: string, message: string, file?: File) => {
    const chatRef = ref(db, `chats/${username}/${sessionId}/messages`);
    let fileUrl = '';

    if (file) {
      const fileRef = storageRef(storage, `chat-files/${username}/${sessionId}/${file.name}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: username,
      content: message,
      timestamp: new Date().toISOString(),
      fileUrl,
    };

    await push(chatRef, newMessage);
    await set(ref(db, `chats/${username}/${sessionId}`), {
      lastMessage: message,
      updatedAt: newMessage.timestamp,
    });
  },

  listenToSessions: (username: string, callback: (sessions: ChatSession[]) => void) => {
    const sessionsRef = ref(db, `chats/${username}`);
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

  listenToMessages: (username: string, sessionId: string, callback: (messages: ChatMessage[]) => void) => {
    const messagesRef = ref(db, `chats/${username}/${sessionId}/messages`);
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