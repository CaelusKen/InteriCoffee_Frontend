import { createEntityHandlers } from "@/lib/api-handler";
import { Merchant } from "@/types/entities";

const merchantHandler = createEntityHandlers<Merchant>("merchants");

export const GET = merchantHandler.getById;
export const PATCH = merchantHandler.update;
export const DELETE = merchantHandler.delete;