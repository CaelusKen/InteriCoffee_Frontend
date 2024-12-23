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
import CustomerDesignCard from "../cards/customer-design-card";
import LoadingPage from "../loading/loading";
import { Label } from "@/components/ui/label";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const fetchDesigns = async (
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<APIDesign>>> => {
  try {
    const response = await api.getPaginated<APIDesign>(
      `designs`,
      undefined,
      accessToken
    );
    console.log("API Response:", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }
};

const fetchAccount = async (email: string): Promise<ApiResponse<Account>> => {
  const response = await api.get(`accounts/${email}/info`);
  return {
    ...response,
    data: mapBackendToFrontend<Account>(response.data, "account"),
  };
};

const fetchOrders = async (): Promise<
  ApiResponse<PaginatedResponse<Order>>
> => {
  return await api.getPaginated<Order>("orders", undefined);
};

const UserHome = () => {
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

  const account = accountQuery.data;

  const designsQuery = useQuery({
    queryKey: ["designs", accessToken],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }
      return fetchDesigns(accessToken);
    },
    enabled: !!accessToken, // Only run the query when accessToken is available
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });

  const designs = designsQuery.data?.data.items
    .filter((item) => item.accountId === account?.id)
    .sort((a, b) => b.updateDate.getTime() - a.updateDate.getTime())
    .slice(0, 4);

  const orders = ordersQuery.data?.data?.items ?? [];

  const accountOrders = orders
    .filter((order) => order.accountId === account?.id)
    .sort((a, b) => b.updatedDate.getTime() - a.updatedDate.getTime())
    .slice(0, 5);

  if (!accountQuery.isLoading && !accountQuery.isSuccess) {
    return <div>Failed to load account data</div>;
  }

  if (designsQuery.isError) {
    console.error("Error fetching designs:", designsQuery.error);
    return <div>Failed to load designs</div>;
  }

  if (designsQuery.isLoading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

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
      <h1 className="text-6xl uppercase mb-2 font-semibold">
        Welcome Back, {account?.userName}!
      </h1>
      <em className="text-xl">Let's begin our journey here at InteriCoffee!</em>
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium mb-2">
              Continue from where you were left of
            </h3>
            <div onClick={() => router.push("/customer/designs")} className="flex justify-between items-center">
                <Button>View all designs</Button>
            </div>
        </div>
        <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-2 justify-items-center">
          {designs?.map((design) => (
            <CustomerDesignCard key={design.id} design={design} />
          )) || <p>No designs found for this account.</p>}
        </div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between">
            <h3 className="text-xl font-medium">Or track your orders</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <Button onClick={() => router.push('/customer/orders')}>View all orders</Button>
              </div>
            </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Ordered Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.replace(/\D/g, "").slice(0, 8)}</TableCell>
                  <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.totalAmount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })} - {order.orderProducts.length} item(s)
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-4 justify-end">
                        <Button variant="outline" size="sm">
                          <Package className="mr-2 h-4 w-4" />
                          Track
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/customer/orders/${order.id}`)}>
                          <Package className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default UserHome;
