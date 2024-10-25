import NextAuth, { DefaultSession } from "next-auth"
import { Session } from "next-auth"

declare module "next-auth" {
    interface User {
      role: string
    }
  }

declare module "next-auth" {
    interface Session {
      user: {
        role?: string
      } & DefaultSession["user"]
    }
}
  
declare module "next-auth/jwt" {
    interface JWT {
        role?: string
    }
}