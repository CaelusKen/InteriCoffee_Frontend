import { createEntityHandlers } from "@/lib/api-handler";
import { Voucher } from "@/types/entities";

const voucherHandler = createEntityHandlers<Voucher>("vouchers");

export const GET = voucherHandler.getAll;
export const POST = voucherHandler.create;