import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";
import { Product } from "@/types/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    try {
        const response: ApiResponse<PaginatedResponse<Product>> = await api.getPaginated<Product>(`/products?page=${page}&pageSize=${pageSize}`);
        return NextResponse.json(response)
    }
    catch(error) {
        console.error('Error fetching products: ', error);
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
        const productData = await request.json();
        const response: ApiResponse<Product> = await api.post<Product>('/products', productData)
        return NextResponse.json(response);
    }
    catch(error) {
        console.error('Error creating products: ', error);
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