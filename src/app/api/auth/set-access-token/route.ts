import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { options } from "../[...nextauth]/options";

export async function POST(req: NextRequest) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accessToken } = await req.json();

    if (!accessToken) {
        return NextResponse.json({ error: "Access token is required" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 3600, // 1 hour
        path: '/',
    });

    return response;
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(options);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = req.cookies.get('access_token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Access token not found" }, { status: 404 });
    }

    return NextResponse.json({ accessToken });
}