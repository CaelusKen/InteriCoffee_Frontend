import { createEntityHandlers } from "@/lib/api-handler";
import { APIDesign } from "@/types/entities";

const designHandler = createEntityHandlers<APIDesign>("designs");

export const GET = designHandler.getAll;
export const POST = designHandler.create;