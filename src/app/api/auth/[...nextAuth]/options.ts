import { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import  CredentialsProvider  from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    pages: {
        signIn: '/login'
    },
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "Your-username",
                },
                password: { 
                    label: "Password", 
                    type: "password" 
                }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch("/your/endpoint", {
                  method: 'POST',
                  body: JSON.stringify(credentials),
                  headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()
          
                // If no error and we have user data, return it
                if (res.ok && user) {
                    return { ...user, role: user.role || "Customer" }
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
            if (account?.provider === "facebook") {
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
                  role: token.role ?? 'Customer'
                }
            };
        },
    }
}

async function fetchRoleFromDatabase(userId: string): Promise<string> {
    // Implement your logic to fetch the user's role from your database
    // This is just a placeholder
    return "Customer" // Default role
}