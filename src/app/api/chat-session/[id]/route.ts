import { createEntityHandlers } from "@/lib/api-handler";
import { ChatSession } from "@/types/entities";

const designHandler = createEntityHandlers<ChatSession>("chat-session");

export const GET = designHandler.getById;
export const PATCH = designHandler.update;
export const DELETE = designHandler.delete;