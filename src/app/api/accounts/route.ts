import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";
import { Account } from "@/types/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    try {
        const response: ApiResponse<PaginatedResponse<Account>> = await api.getPaginated<Account>(`/accounts?page=${page}&pageSize=${pageSize}`);
        return NextResponse.json(response)
    }
    catch(error) {
        console.error('Error fetching accounts: ', error);
        return NextResponse.json(
            {
                error: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const accountData = await request.json();
        const response: ApiResponse<Account> = await api.post<Account>('/accounts', accountData)
        return NextResponse.json(response);
    }
    catch(error) {
        console.error('Error creating account: ', error);
        return NextResponse.json(
            {
                error: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}

//Implement the rest similar to this formular