import { createEntityHandlers } from "@/lib/api-handler";
import { Style } from "@/types/entities";

const styleHandler = createEntityHandlers<Style>("styles");

export const GET = styleHandler.getById;
export const PATCH = styleHandler.update;
export const DELETE = styleHandler.delete;