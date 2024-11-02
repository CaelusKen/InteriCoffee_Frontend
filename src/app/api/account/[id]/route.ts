import { NextRequest } from "next/server";
import { createEntityHandlers } from "@/lib/api-handler";
import { Account } from "@/types/entities";

const accountHandler = createEntityHandlers<Account>("accounts");

export const GET = accountHandler.getById;
export const PATCH = accountHandler.update;
export const DELETE = accountHandler.delete;