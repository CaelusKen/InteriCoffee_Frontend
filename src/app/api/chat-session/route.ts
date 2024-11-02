import { createEntityHandlers } from "@/lib/api-handler";
import { ChatSession } from "@/types/entities";

const chatSessionHandler = createEntityHandlers<ChatSession>("chat-sessions");

export const GET = chatSessionHandler.getAll;
export const POST = chatSessionHandler.create;