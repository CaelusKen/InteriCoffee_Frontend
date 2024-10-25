import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

const ROLES = ["Manager", "Merchant", "Consultant", "Customer"]

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname
        const role = path.split("/")[1] // Extracts role from the URL

        if (token?.role !== role) {
            // Redirect to home or access denied page if role doesn't match
            return NextResponse.redirect(new URL("/", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => ROLES.includes(token?.role as string)
        }
    }
)

export const config = {
    matcher: [
        "/manager/:path*",
        "/merchant/:path*",
        "/consultant/:path*",
        "/customer/:path*"
    ]
}