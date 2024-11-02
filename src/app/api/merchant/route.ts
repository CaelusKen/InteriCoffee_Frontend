import { createEntityHandlers } from "@/lib/api-handler";
import { Merchant } from "@/types/entities";

const merchantHandler = createEntityHandlers<Merchant>("merchants");

export const GET = merchantHandler.getAll;
export const POST = merchantHandler.create;