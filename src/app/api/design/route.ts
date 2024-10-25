import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";
import { Design } from "@/types/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    try {
        const response: ApiResponse<PaginatedResponse<Design>> = await api.getPaginated<Design>(`/designs?page=${page}&pageSize=${pageSize}`);
        return NextResponse.json(response)
    }
    catch(error) {
        console.error('Error fetching designs: ', error);
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
        const designData = await request.json();
        const response: ApiResponse<Design> = await api.post<Design>('/designs', designData)
        return NextResponse.json(response);
    }
    catch(error) {
        console.error('Error creating designs: ', error);
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