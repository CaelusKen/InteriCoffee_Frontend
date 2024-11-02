import { createEntityHandlers } from "@/lib/api-handler";
import { Product } from "@/types/entities";

const productHandler = createEntityHandlers<Product>("products");

export const GET = productHandler.getById;
export const PATCH = productHandler.update;
export const DELETE = productHandler.delete;