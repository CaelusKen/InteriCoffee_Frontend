import { createEntityHandlers } from "@/lib/api-handler";
import { Voucher } from "@/types/entities";

const voucherHandler = createEntityHandlers<Voucher>("vouchers");

export const GET = voucherHandler.getById;
export const PATCH = voucherHandler.update;
export const DELETE = voucherHandler.delete;