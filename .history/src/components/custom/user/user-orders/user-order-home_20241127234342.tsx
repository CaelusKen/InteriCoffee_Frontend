"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Account, APIDesign, Order } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "@/hooks/use-access-token";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const fetchOrders = async (): Promise<
  ApiResponse<PaginatedResponse<Order>>
> => {
  return await api.getPaginated<Order>("orders", undefined);
};

const OrderHome = () => {
  const { data: session } = useSession();

  const accessToken = useAccessToken();

  const router = useRouter();

  const accountQuery = useQuery({
    queryKey: ["account", session?.user.email],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Account>>(
        `accounts/${session?.user.email}/info`
      );
      return mapBackendToFrontend<Account>(response.data, "account");
    },
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  const account = accountQuery.data;

  const orders = ordersQuery.data?.data?.items ?? [];

  const accountOrders = orders
    .filter((order) => order.accountId === account?.id)
    .sort((a, b) => b.updatedDate.getTime() - a.updatedDate.getTime());

  //Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const [ordersPerPage] = React.useState(10);
  const indexOfLastOrder = currentPage * ordersPerPage;

  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const paginatedOrders = accountOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "SHIPPED":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section className="px-10 py-4">
      <h1 className="text-6xl uppercase mb-2 font-semibold">Order Table</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Order ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order at</TableHead>
              <TableHead>Updated at</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="w-[160px]">{order.id}</TableCell>
                <TableCell>
                  {order.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </TableCell>
                <TableCell>{order.orderProducts.length} item(s)</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.orderDate.toLocaleString("vi-VN")}</TableCell>
                <TableCell>{order.updatedDate.toLocaleString("vi-VN")}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/customer/orders/${order.id}`)}
                  >
                    <Package className="mr-2" />
                    Details
                  </Button>
                  {order.status === "COMPLETED" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => router.push(`/customer/orders/${order.id}/cancel`)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default OrderHome;
