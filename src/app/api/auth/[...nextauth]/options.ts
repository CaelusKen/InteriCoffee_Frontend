import { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import  CredentialsProvider  from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';

function decodeAccessToken(token: string): { role: string } | null {
    try {
      const decoded = jwt.decode(token) as { [key: string]: any } | null;
      if (decoded) {
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        return { role: role };
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
}

export const options: NextAuthOptions = {
    pages: {
        signIn: '/login'
    },
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email:",
                    type: "text",
                    placeholder: "your-email@example.com",
                  },
                password: { 
                    label: "Password", 
                    type: "password" 
                }
            },
            async authorize(credentials, req) {
                const res = await fetch("https://interior-coffee-api-f2d9dqd2eyccesfq.southeastasia-01.azurewebsites.net/api/v1/auth/login", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                  });
                const user = await res.json()
                if (res.ok && user) {
                    const decodedToken = decodeAccessToken(user['access-token']);
                    return { ...user, role: decodedToken?.role || user.role }
                }
                return null
              }
        }),
    ],
    callbacks: {
        async jwt({token, user, account}) {
            if(user) {
                token.role = user.role
            }
            if (account?.provider === "facebook" || account?.provider === "google") {
                token.role = "CUSTOMER"
            }
            return token
        },
        async session({session, token}) {
            return {
                ...session,
                user: {
                  ...session.user,
                  role: token.role
                }
            };
        },
        async redirect({ url, baseUrl }) {
            const hostname = process.env.VERCEL_URL
                ? `${process.env.VERCEL_URL}`
                : process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
            if (url.startsWith("/")) 
            {
                return `${hostname}${url}`
            }
            else if (new URL(url).origin === hostname) {
                return url
            }
            return hostname
        }
    }
}