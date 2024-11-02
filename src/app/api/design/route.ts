import { createEntityHandlers } from "@/lib/api-handler";
import { ApiDesign } from "@/types/entities";

const designHandler = createEntityHandlers<ApiDesign>("designs");

export const GET = designHandler.getAll;
export const POST = designHandler.create;