import { createEntityHandlers } from "@/lib/api-handler";
import { Transaction } from "@/types/entities";

const transactionHandler = createEntityHandlers<Transaction>("transactions");

export const GET = transactionHandler.getById;
export const PATCH = transactionHandler.update;
export const DELETE = transactionHandler.delete;