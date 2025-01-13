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
import { useAccessToken } from "@/hooks/use-access-token";

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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MoreHorizontal } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const fetchAccountByEmail = async (
  email: string
): Promise<ApiResponse<Account>> => {
  return api.get<Account>(`accounts/${email}/info`);
};

const fetchMerchantOrders = async (
  merchantId: string,
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<any>>> => {
  return api.get<any>(`orders/merchant/${merchantId}`, undefined, accessToken);
};

const getColumns = (
  getStatusColor: (status: Order["status"]) => string,
  router: ReturnType<typeof useRouter>
): ColumnDef<Order>[] => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.original.id.replace(/\D/g, "").slice(0, 8),
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Order Date
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.original.orderDate).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) =>
        `${row.original.totalAmount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={`${getStatusColor(row.original.status)} text-white`}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/merchant/orders/${row.original.id}`)}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

const MerchantsOrderTable = () => {
  const { data: session } = useSession();
  const accessToken = useAccessToken();
  const router = useRouter();

  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const getStatusColor = (status: Order["status"]) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-secondary";
      case "processing":
        return "bg-warning";
      case "shipped":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-primary";
    }
  };

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
    queryFn: () => fetchMerchantOrders(merchantId!, accessToken ?? ''),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      mapBackendListToFrontend<Order>(data.data.items, "order").items,
  });

  const columns = React.useMemo(
    () => getColumns(getStatusColor, router),
    [router]
  );

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
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  if (!accountQuery.data?.data || !ordersQuery.data) {
    return (
      <div className="flex items-center justify-center p-8">
        Error fetching data
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

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