import { createEntityHandlers } from "@/lib/api-handler";
import { Template } from "@/types/entities";

const templateHandler = createEntityHandlers<Template>("templates");

export const GET = templateHandler.getById;
export const PATCH = templateHandler.update;
export const DELETE = templateHandler.delete;