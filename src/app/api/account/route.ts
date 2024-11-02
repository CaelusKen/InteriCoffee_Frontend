import { NextRequest } from "next/server";
import { createEntityHandlers } from "@/lib/api-handler";
import { Account } from "@/types/entities";

const accountHandler = createEntityHandlers<Account>("accounts");

export const GET = accountHandler.getAll;
export const POST = accountHandler.create;