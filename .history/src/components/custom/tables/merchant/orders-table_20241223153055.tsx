"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  mapBackendToFrontend,
  mapBackendListToFrontend,
} from "@/lib/entity-handling/handler";
import { api } from "@/service/api";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Account, Order } from "@/types/frontend/entities";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const fetchAccountByEmail = async (
  email: string
): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`);
};

const fetchMerchantOrders = async (
  merchantId: string
): Promise<ApiResponse<PaginatedResponse<any>>> => {
  return api.get<any>(`orders/merchant/${merchantId}`);
};

const MerchantsOrderTable = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Account Query
  const accountQuery = useQuery({
    queryKey: ["accountByEmail", session?.user.email],
    queryFn: () => fetchAccountByEmail(session?.user.email ?? ""),
    enabled: !!session?.user.email,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get merchant ID from account data
  const merchantId = accountQuery.data?.data
    ? mapBackendToFrontend<Account>(accountQuery.data.data, "account")
        .merchantId
    : null;

  // Orders Query - depends on merchantId
  const ordersQuery = useQuery({
    queryKey: ["merchantOrders", merchantId],
    queryFn: () => fetchMerchantOrders(merchantId!),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      mapBackendListToFrontend<Order>(data.data.items, "order").items,
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500";
      case "Shipped":
        return "bg-blue-500";
      case "Delivered":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Setup Order Table
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order Id",
      cell: ({ row }) => row.original.id.replace(/\D/g, "").slice(0, 8),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) =>
        `${row.original.totalAmount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) =>
        new Date(row.original.orderDate).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge
            variant="secondary"
            className={`${getStatusColor(row.original.status)} text-white`}
          >
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/merchant/orders/${product.id}`)}
              >
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: ordersQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  if (accountQuery.isLoading || ordersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!accountQuery.data?.data || !ordersQuery.data) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MerchantsOrderTable;
