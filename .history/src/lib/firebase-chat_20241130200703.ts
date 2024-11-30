import { ref, set, push, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { realtimeDb, storage } from '@/service/firebase';
import { api } from '@/service/api';
import { Merchant } from '@/types/frontend/entities';

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
  searchMerchants: async (searchTerm: string) => {
    const merchantsRef = ref(realtimeDb, 'merchants');
    const searchQuery = query(merchantsRef, orderByChild('name'), equalTo(searchTerm));
    
    return new Promise((resolve, reject) => {
      onValue(searchQuery, (snapshot) => {
        const merchants : Merchant[] = [];
        snapshot.forEach((childSnapshot) => {
          merchants.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        resolve(merchants);
      }, (error) => {
        reject(error);
      });
    });
  },

  createOrGetChatSession: async (customerId: string, merchantId: string) => {
    const sessionRef = ref(realtimeDb, `chatSessions/${customerId}_${merchantId}`);
    
    return new Promise((resolve, reject) => {
      onValue(sessionRef, async (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          try {
            const newSession = {
              id: `${customerId}_${merchantId}`,
              customerId,
              merchantId,
              createdAt: new Date().toISOString(),
              messages: []
            };
            await set(sessionRef, newSession);
            
            // Save to backend API
            await api.post('chat-sessions', newSession);
            
            resolve(newSession);
          } catch (error) {
            reject(error);
          }
        }
      }, {
        onlyOnce: true
      });
    });
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

  loadChatHistory: async(sessionId: string) => {
    try {
      await api.getById<ChatSession>('chat-sessions', sessionId).then((res) => {
        if(res.status === 200) {
          console.log('Chat history loaded:', res.data);
        }
        else {
          console.error('Failed to load chat history:', res.message);
        }
      })
    } catch (err) {
      console.error('Error in loadChatHistory:', err);
    }
  }
};