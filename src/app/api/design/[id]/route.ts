import { createEntityHandlers } from "@/lib/api-handler";
import { ApiDesign } from "@/types/entities";

const designHandler = createEntityHandlers<ApiDesign>("designs");

export const GET = designHandler.getById;
export const PATCH = designHandler.update;
export const DELETE = designHandler.delete;