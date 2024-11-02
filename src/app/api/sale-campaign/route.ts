import { createEntityHandlers } from "@/lib/api-handler";
import { SaleCampaign } from "@/types/entities";

const saleCampaignHandler = createEntityHandlers<SaleCampaign>("sale-campaigns");

export const GET = saleCampaignHandler.getAll;
export const POST = saleCampaignHandler.create;