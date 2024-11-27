"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Account } from "@/types/frontend/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { api } from "@/service/api";
import LoadingPage from "@/components/custom/loading/loading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAccessToken } from "@/hooks/use-access-token";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { BanWarningDialog } from "../../sections/body/manager/accounts/ban-account-dialog";

export const fetchAccounts = async (
  page = 1,
  pageSize = 10,
  accessToken = ""
): Promise<ApiResponse<PaginatedResponse<Account>>> => {
  return api.getPaginated<Account>("accounts", { page, pageSize }, accessToken);
};

export default function AccountsTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const router = useRouter();

  const accessToken = useAccessToken();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const accountsQuery = useQuery({
    queryKey: ["accounts", page],
    queryFn: () => fetchAccounts(page, 10, accessToken || ""),
    enabled: !!accessToken,
  });

  const accounts = accountsQuery.data?.data?.items ?? [];
  const totalCount = accountsQuery.data?.data?.totalCount ?? 0;

  //For Pagination
  const handlePreviousPage = () => setPage(page - 1);
  const handleNextPage = () => setPage(page + 1);
  const handleSetPage = (newPage: number) => setPage(newPage);

  //Slice the list to match the current page
  const slicedAccounts = accounts.slice((page - 1) * pageSize, page * pageSize);

  //For ban/unban accounts
  const banAccountMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch<Account>(
        `accounts/${id}`,
        { status: "INACTIVE" },
        undefined,
        accessToken ?? ""
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts"] as any);
      toast({
        title: "Account Banned",
        description: "The account has been banned successfully.",
        className: "bg-red-500",
      });
      setBanDialogOpen(false);
    },
  });

  const unbanAccountMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch<Account>(
        `accounts/${id}`,
        { status: "ACTIVE" },
        undefined,
        accessToken ?? ""
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts"] as any);
      toast({
        title: "Account Unbanned",
        description: "The account has been unbanned successfully.",
        className: "bg-green-500",
      });
    },
  });

  const handleBanAccount = (account: Account) => {
    setSelectedAccount(account);
    setBanDialogOpen(true);
  };

  const handleConfirmBan = () => {
    if (selectedAccount) {
      banAccountMutation.mutate(selectedAccount.id);
    }
  };

  const handleUnbanAccount = (id: string) => {
    unbanAccountMutation.mutate(id);
  };

  if (accountsQuery.isLoading) return <LoadingPage />;
  if (accountsQuery.isError) return <div>Error loading accounts</div>;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>

      {/* Account List */}
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                {/* <TableHead>Phone</TableHead> */}
                {/* <TableHead>Address</TableHead> */}
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created Date</TableHead>
                {/* <TableHead>Updated Date</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slicedAccounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <img
                      src={
                        account.avatar
                          ? account.avatar
                          : "https://github.com/shadcn.png"
                      }
                      alt={account.userName}
                      className="w-[40px] rounded-full h-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{account.userName}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  {/* <TableCell>{account.phoneNumber}</TableCell> */}
                  {/* <TableCell>{account.address}</TableCell> */}
                  <TableCell>
                    <Badge
                      variant={"default"}
                      className={`${
                        account.status === "ACTIVE"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {account.status === "ACTIVE" ? "Active" : "Banned"}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>
                    {account.createdDate.toLocaleDateString("vi-VN")}
                  </TableCell>
                  {/* <TableCell>{account.updatedDate.toLocaleDateString()}</TableCell> */}
                  {/* This will be a toggler for the status of the account */}
                  <TableCell className="flex justify-end items-center gap-4">
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/manager/accounts/${account.id}`)
                      }
                    >
                      Details
                    </Button>
                    {account.status === "ACTIVE" ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBanAccount(account)}
                      >
                        Ban
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnbanAccount(account.id)}
                      >
                        Unban
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === Math.ceil(totalCount / pageSize)}
              >
                Next
              </Button>
              <div className="flex items-center gap-2">
                <span>
                  Page {page} of {Math.ceil(totalCount / pageSize)},
                </span>
                <span>Total {totalCount} accounts</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetPage(1)}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetPage(Math.ceil(totalCount / pageSize))}
              >
                Last
              </Button>
            </div>
          </div>
        </>
      )}

      <BanWarningDialog
        isOpen={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        onConfirm={handleConfirmBan}
        accountName={selectedAccount?.userName ?? ""}
      />
    </section>
  );
}
