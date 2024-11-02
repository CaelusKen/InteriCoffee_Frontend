import { createEntityHandlers } from "@/lib/api-handler";
import { Template } from "@/types/entities";

const templateHandler = createEntityHandlers<Template>("templates");

export const GET = templateHandler.getAll;
export const POST = templateHandler.create;