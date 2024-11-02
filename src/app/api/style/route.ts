import { createEntityHandlers } from "@/lib/api-handler";
import { Style } from "@/types/entities";

const styleHandler = createEntityHandlers<Style>("styles");

export const GET = styleHandler.getAll;
export const POST = styleHandler.create;