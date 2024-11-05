import { createEntityHandlers } from "@/lib/api-handler";
import { APIDesign } from "@/types/entities";

const designHandler = createEntityHandlers<APIDesign>("designs");

export const GET = designHandler.getById;
export const PATCH = designHandler.update;
export const DELETE = designHandler.delete;