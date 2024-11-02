import { createEntityHandlers } from "@/lib/api-handler";
import { Review } from "@/types/entities";

const reviewHandler = createEntityHandlers<Review>("reviews");

export const GET = reviewHandler.getAll;
export const POST = reviewHandler.create;