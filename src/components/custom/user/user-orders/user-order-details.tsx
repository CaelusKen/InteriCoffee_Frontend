"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAccessToken } from "@/hooks/use-access-token";
import { api } from "@/service/api";
import { Order, Product } from "@/types/frontend/entities";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { mapBackendToFrontend } from "@/lib/entity-handling/handler";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import FurnitureProductCard from "../../cards/furniture-card-v2";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Package } from "lucide-react";
import router from "next/router";
import { Button } from "@/components/ui/button";

const fetchOrderById = async (id: string, accessToken: string) => {
  return api.getById<Order>("orders", id, accessToken);
};

interface UserOrderDetailsProps {
  id: string;
}

const UserOrderDetails = ({ id }: UserOrderDetailsProps) => {
  const accessToken = useAccessToken();

  const orderQuery = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id ?? "", accessToken ?? ""),
    enabled: !!id,
  });

  const order = orderQuery.data?.data ?? null;

  return (
    <div className="p-10">
      {order && (
        <>
            <h3 className="text-2xl font-semibold my-4">Order {order.id} Details</h3>
            <Card>
              <CardHeader title="Order Details" />
              <CardContent>
                <CardDescription>Status: {order.status}</CardDescription>
                <CardDescription>Total: {order.totalAmount.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</CardDescription>
                <CardDescription>Items:</CardDescription>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          {product.price.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" onClick={() => window.history.back()}>Back</Button>
              </CardFooter>
            </Card>
        </>
      )}
    </div>
  );
};

export default UserOrderDetails;
