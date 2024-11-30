import { ref, set, push, onValue, off, query, orderByChild, equalTo, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { realtimeDb, storage } from '@/service/firebase';
import { api } from '@/service/api';
import { Merchant, ChatSession } from '@/types/frontend/entities';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
}

interface DefaultMessage {
  trigger: string;
  response: string;
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

  // Add a function to assign a consultant to a chat session
  assignConsultant: async (sessionId: string, consultantId: string) => {
    const sessionRef = ref(realtimeDb, `chatSessions/${sessionId}`);
    await update(sessionRef, { assignedConsultantId: consultantId });
    
    // Update in backend API
    await api.patch(`chat-sessions/${sessionId}`, { assignedConsultantId: consultantId });
  },

  // Add a function to set up default messages for a merchant
  setDefaultMessages: async (merchantId: string, defaultMessages: any[]) => {
    const defaultMessagesRef = ref(realtimeDb, `merchantDefaultMessages/${merchantId}`);
    await set(defaultMessagesRef, defaultMessages);
    
    // Save to backend API
    await api.post(`merchants/${merchantId}/default-messages`, { defaultMessages });
  },

  // Add a function to get default messages for a merchant
  getDefaultMessages: async (merchantId: string): Promise<DefaultMessage[]> => {
    const defaultMessagesRef = ref(realtimeDb, `merchantDefaultMessages/${merchantId}`);
    const snapshot = await get(defaultMessagesRef);
    return snapshot.val() || [];
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

    const session = await get(ref(realtimeDb, `chatSessions/${sessionId}`));
    const sessionData = session.val();

    if (sessionData.merchantId === email || sessionData.assignedConsultantId === email) {
      const defaultMessages = await firebaseChat.getDefaultMessages(sessionData.merchantId);
      if (defaultMessages) {
        const matchingDefaultMessage = defaultMessages.find((dm: DefaultMessage) => dm.trigger === message);
        if (matchingDefaultMessage) {
          await push(chatRef, {
            id: uuidv4(),
            sender: email,
            content: matchingDefaultMessage.response,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

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


  // Add a function to handle video calls
  initiateVideoCall: async (sessionId: string) => {
    // Implement video call logic here
    // This could involve creating a new entry in Firebase for the call
    // and returning the necessary information to start the call
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
          messages: session.messages,
          customerId: session.customerId,
          advisorId: session.advisorId,
          createdDate: session.createdDate,
          updatedDate: session.updatedDate,
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

  saveChatSessionToBackend: async (sessionId: string) => {
    const sessionRef = ref(realtimeDb, `chatSessions/${sessionId}`);
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
      const sessionData = snapshot.val();
      await api.patch(`chat-sessions/${sessionId}`, sessionData);
    }
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