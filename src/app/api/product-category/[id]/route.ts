import { createEntityHandlers } from "@/lib/api-handler";
import { ProductCategory } from "@/types/entities";

const productCategoryHandler = createEntityHandlers<ProductCategory>("product-categories");

export const GET = productCategoryHandler.getById;
export const PATCH = productCategoryHandler.update;
export const DELETE = productCategoryHandler.delete;