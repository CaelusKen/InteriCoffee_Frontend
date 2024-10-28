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
        return { role: role || "CUSTOMER" };
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
          
                // If no error and we have user data, return it
                if (res.ok && user) {
                    const decodedToken = decodeAccessToken(user['access-token']);
                    return { ...user, role: user.role || "CUSTOMER" }
                }
                // Return null if user data could not be retrieved
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
                // Fetch user role from your database based on the Facebook ID
                // This is just an example, implement according to your backend
                const role = await fetchRoleFromDatabase(user.id)
                token.role = role
            }
            return token
        },
        async session({session, token}) {
            return {
                ...session,
                user: {
                  ...session.user,
                  role: token.role ?? 'CUSTOMER'
                }
            };
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    }
}

async function fetchRoleFromDatabase(userId: string): Promise<string> {
    // Implement your logic to fetch the user's role from your database
    // This is just a placeholder
    return "CUSTOMER" // Default role
}