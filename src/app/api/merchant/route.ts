import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";
import { Merchant } from "@/types/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    try {
        const response: ApiResponse<PaginatedResponse<Merchant>> = await api.getPaginated<Merchant>(`/merchants?page=${page}&pageSize=${pageSize}`);
        return NextResponse.json(response)
    }
    catch(error) {
        console.error('Error fetching merchants: ', error);
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
        const merchantData = await request.json();
        const response: ApiResponse<Merchant> = await api.post<Merchant>('/merchants', merchantData)
        return NextResponse.json(response);
    }
    catch(error) {
        console.error('Error creating merchant: ', error);
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