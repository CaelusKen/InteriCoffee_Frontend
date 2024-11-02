import { createEntityHandlers } from "@/lib/api-handler";
import { Product } from "@/types/entities";

const productHandler = createEntityHandlers<Product>("products");

export const GET = productHandler.getAll;
export const POST = productHandler.create;