import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  addDoc,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot 
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { Account, Merchant } from '@/types/frontend/entities'
import { FirestoreChat, FirestoreChatParticipant, FirestoreMessage } from '@/types/firestore'
import { storage, db } from "@/service/firebase"
import { accountToFirestoreParticipant, merchantToFirestoreParticipant } from './entity-handling/chat-mapping-handler'

export async function uploadFile(file: File, chatId: string): Promise<string> {
  const fileExtension = file.name.split('.').pop() || ''
  const fileName = `${uuidv4()}.${fileExtension}`
  const storageRef = ref(storage, `chats/${chatId}/files/${fileName}`)
  
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function createChat(account: Account, merchant: Merchant): Promise<string> {
    if (!account?.id || !merchant?.id) {
      throw new Error('Invalid account or merchant data');
    }
  
    const customerParticipant: FirestoreChatParticipant = {
      id: account.id,
      name: account.userName || 'Unknown User',
      email: account.email || '',
      role: 'customer',
      avatar: account.avatar
    };
  
    const merchantParticipant: FirestoreChatParticipant = {
      id: merchant.id,
      name: merchant.name || 'Unknown Merchant',
      email: merchant.email || '',
      role: 'merchant',
      avatar: merchant.logoUrl
    };
  
    const chatData: Omit<FirestoreChat, 'id'> = {
      participants: [customerParticipant, merchantParticipant],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: {
        content: '',
        senderId: '',
        timestamp: Timestamp.now(),
        type: 'text'
      }
    };
  
    try {
      // Check if chat already exists
      const existingChatsQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', customerParticipant)
      );
      
      const querySnapshot = await getDocs(existingChatsQuery);
      const existingChat = querySnapshot.docs.find(doc => {
        const data = doc.data() as FirestoreChat;
        return data.participants.some(p => p.id === merchant.id);
      });
  
      if (existingChat) {
        console.log('Existing chat found:', existingChat.id);
        return existingChat.id;
      }
  
      // Create new chat if none exists
      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      console.log('New chat created with ID:', chatRef.id);
      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  export async function sendMessage(
    chatId: string, 
    senderId: string, 
    content: string, 
    type: 'text' | 'image' | 'video' = 'text', 
    fileUrl?: string
  ): Promise<void> {
    try {
      // Create a new message document reference
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const newMessageRef = doc(messagesRef);
  
      // Create the message data with all required fields
      const messageData: FirestoreMessage = {
        id: newMessageRef.id,
        chatId,
        content,
        senderId,
        timestamp: Timestamp.now(),
        type,
        fileUrl: fileUrl || null || '',
        status: 'sent'
      };
  
      // Set the message document
      await setDoc(newMessageRef, messageData);
  
      // Update the chat's lastMessage
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: {
          content,
          timestamp: messageData.timestamp,
          senderId,
          type
        },
        updatedAt: serverTimestamp()
      });
  
      console.log('Message sent successfully:', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

export function subscribeToChat(chatId: string, callback: (messages: FirestoreMessage[]) => void): () => void {
  const messagesRef = collection(db, 'chats', chatId, 'messages')
  const q = query(messagesRef, orderBy('timestamp', 'asc'))

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as FirestoreMessage[]
    callback(messages)
  })
}

export function subscribeToChats(userId: string, callback: (chats: FirestoreChat[]) => void): () => void {
  const chatsRef = collection(db, 'chats')
  const q = query(
    chatsRef,
    where('participants', 'array-contains', { id: userId }),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as FirestoreChat[]
    callback(chats)
  })
}

export async function markMessageAsRead(chatId: string, messageId: string, userId: string): Promise<void> {
  await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
    status: 'read'
  })

  await updateDoc(doc(db, 'chats', chatId), {
    [`participants.${userId}.lastRead`]: serverTimestamp()
  })
}

export async function getUnreadCount(chatId: string, userId: string): Promise<number> {
  const chatDoc = await getDoc(doc(db, 'chats', chatId))
  const chat = chatDoc.data() as FirestoreChat
  const participant = chat.participants.find(p => p.id === userId)
  
  if (!participant?.lastRead) {
    return 0
  }

  const messagesRef = collection(db, 'chats', chatId, 'messages')
  const q = query(
    messagesRef,
    where('timestamp', '>', participant.lastRead),
    where('senderId', '!=', userId)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.size
}

export async function fetchChatById(chatId: string): Promise<FirestoreChat | null> {
    const chatDoc = await getDoc(doc(db, 'chats', chatId))
    if (chatDoc.exists()) {
      return { id: chatDoc.id, ...chatDoc.data() } as FirestoreChat
    }
    return null
  }
