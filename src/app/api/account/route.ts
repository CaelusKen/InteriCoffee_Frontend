import { createEntityHandlers } from "@/lib/api-handler";
import { Account } from "@/types/entities";
import { NextRequest } from "next/server";

const accountHandler = createEntityHandlers<Account>("accounts");

// export const GET = accountHandler.getAll;
// export const POST = accountHandler.create;

export async function GET(request: NextRequest) {
  return accountHandler.getAll(request);
}

export async function POST(request: NextRequest) {
  return accountHandler.create(request);
}