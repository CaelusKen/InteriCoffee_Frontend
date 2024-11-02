import { createEntityHandlers } from "@/lib/api-handler";
import { Order } from "@/types/entities";

const orderHandlers = createEntityHandlers<Order>("orders");

export const GET = orderHandlers.getById;
export const PATCH = orderHandlers.update;
export const DELETE = orderHandlers.delete;