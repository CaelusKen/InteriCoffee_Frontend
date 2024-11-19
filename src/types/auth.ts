import NextAuth, { DefaultSession } from "next-auth"
import { Session } from "next-auth"

declare module "next-auth" {
    interface User {
      role: string
      "access-token"?: string
    }
  }

declare module "next-auth" {
    interface Session {
      user: {
        accessToken?: string
        role?: string
      } & DefaultSession["user"]
    }
}
  
declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        accessToken?: string
    }
}