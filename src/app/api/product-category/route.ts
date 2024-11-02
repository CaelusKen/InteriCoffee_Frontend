import { createEntityHandlers } from "@/lib/api-handler";
import { ProductCategory } from "@/types/entities";

const productCategoryHandler = createEntityHandlers<ProductCategory>("product-categories");

export const GET = productCategoryHandler.getAll;
export const POST = productCategoryHandler.create;