import { User } from "@/types/chat"
import { Account, Merchant } from '@/types/frontend/entities'
import { FirestoreChatParticipant } from '@/types/firestore'

export function accountToFirestoreParticipant(account: Account): FirestoreChatParticipant {
  return {
    id: account.id,
    name: account.userName,
    email: account.email,
    avatar: account.avatar || undefined,
    role: 'customer'
  }
}

export function merchantToFirestoreParticipant(merchant: Merchant): FirestoreChatParticipant {
  return {
    id: merchant.id,
    name: merchant.name,
    email: merchant.email,
    avatar: merchant.logoUrl || undefined,
    role: 'merchant'
  }
}