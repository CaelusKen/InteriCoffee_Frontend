import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const ROLES = ["MANAGER", "MERCHANT", "CONSULTANT", "CUSTOMER"]

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname
        const role = path.split("/")[1].toUpperCase() // Extracts role from the URL

        if (token?.role?.toUpperCase() !== role) {
            // Redirect to home or access denied page if role doesn't match
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token?.accessToken && ROLES.includes(token?.role as string)
        }
    }
)

export const config = {
    matcher: [
        "/manager/:path*",
        "/merchant/:path*",
        "/consultant/:path*",
        "/customer/:path*",
    ]
}