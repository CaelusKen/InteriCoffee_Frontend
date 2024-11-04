import { createEntityHandlers } from "@/lib/api-handler";
import { Account } from "@/types/entities";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/service/api";

const accountHandler = createEntityHandlers<Account>("accounts");

// export const GET = accountHandler.getAll;
// export const POST = accountHandler.create;

export async function GET(request: NextRequest) {
  return accountHandler.getAll(request);
}

export async function POST(request: NextRequest) {
    try {
      const data = await request.json();
      
      // Validate required fields
      const requiredFields = ['username', 'email', 'phoneNumber', 'status'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json(
            { error: `Missing required field: ${field}` },
            { status: 400 }
          );
        }
      }
  
      // Format the data to match backend expectations
      const formattedData = {
        "user-name": data.username,
        "email": data.email,
        "phone-number": data.phoneNumber,
        "address": data.address || "",
        "status": data.status,
        "avatar": data.avatar || "",
        "merchant-id": data.merchantId || "",
        "role-id": data.roleId || ""
      };
  
      const response = await api.post<Account>("accounts", formattedData);
  
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`API returned status ${response.status}: ${response.message}`);
      }
  
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error in account POST route:", error);
      return NextResponse.json(
        { 
          error: "Failed to create account",
          details: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  }