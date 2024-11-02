import { createEntityHandlers } from "@/lib/api-handler";
import { Order } from "@/types/entities";

const orderHandlers = createEntityHandlers<Order>("orders");

export const GET = orderHandlers.getAll;
export const POST = orderHandlers.create;