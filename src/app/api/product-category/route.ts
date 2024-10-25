import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";
import { ProductCategory } from "@/types/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('pageSize') || '10'

    try {
        const response: ApiResponse<PaginatedResponse<ProductCategory>> = await api.getPaginated<ProductCategory>(`/productCategory?page=${page}&pageSize=${pageSize}`);
        return NextResponse.json(response)
    }
    catch(error) {
        console.error('Error fetching product categories: ', error);
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
        const productCategoryData = await request.json();
        const response: ApiResponse<ProductCategory> = await api.post<ProductCategory>('/productCategory', productCategoryData)
        return NextResponse.json(response);
    }
    catch(error) {
        console.error('Error creating product category: ', error);
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