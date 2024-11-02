import { createEntityHandlers } from "@/lib/api-handler";
import { Review } from "@/types/entities";

const reviewHandler = createEntityHandlers<Review>("reviews");

export const GET = reviewHandler.getById;
export const PATCH = reviewHandler.update;
export const DELETE = reviewHandler.delete;