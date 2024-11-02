import { createEntityHandlers } from "@/lib/api-handler";
import { SaleCampaign } from "@/types/entities";

const saleCampaignHandler = createEntityHandlers<SaleCampaign>("sale-campaigns");

export const GET = saleCampaignHandler.getById;
export const PATCH = saleCampaignHandler.update;
export const DELETE = saleCampaignHandler.delete;