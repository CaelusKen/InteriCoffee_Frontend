import { createEntityHandlers } from "@/lib/api-handler";
import { Transaction } from "@/types/entities";

const transactionHandler = createEntityHandlers<Transaction>("transactions");

export const GET = transactionHandler.getAll;
export const POST = transactionHandler.create;