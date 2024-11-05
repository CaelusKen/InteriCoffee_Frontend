"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Account } from "@/types/entities";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { api } from "@/service/api";
import LoadingPage from "@/components/custom/loading/loading";

// API functions
const fetchAccounts = async (
  page = 1,
  pageSize = 10
): Promise<ApiResponse<PaginatedResponse<Account>>> => {
  return api.getPaginated<Account>("accounts", { page, pageSize });
};

const fetchAccountById = async (id: string): Promise<ApiResponse<Account>> => {
  return api.getById<Account>("accounts", id);
};

const createAccount = async (
  account: Omit<Account, "_id" | "id" | "created-date" | "updated-date">
): Promise<ApiResponse<Account>> => {
  return api.post<Account>("accounts", account);
};

const updateAccount = async (
  account: Account
): Promise<ApiResponse<Account>> => {
  return api.patch<Account>(`accounts/${account._id}`, account);
};

const deleteAccount = async (id: string): Promise<ApiResponse<Account>> => {
  return api.delete<Account>(`accounts/${id}`);
};

export default function AccountManagement() {
  const [page, setPage] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  // Queries
  const accountsQuery = useQuery({
    queryKey: ["accounts", page],
    queryFn: () => fetchAccounts(page),
  });

  const accounts = accountsQuery.data?.data?.items ?? [];
  const totalCount = accountsQuery.data?.data?.totalCount ?? 0;
  const pageSize = accountsQuery.data?.data?.pageSize ?? 10;

  const selectedAccountQuery = useQuery({
    queryKey: ["account", selectedAccountId],
    queryFn: () =>
      selectedAccountId ? fetchAccountById(selectedAccountId) : null,
    enabled: !!selectedAccountId,
  });

  // Mutations
  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error creating account:", error);
      // Handle error (e.g., show error message to user)
    }
  });

  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({
        queryKey: ["account", selectedAccountId],
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setSelectedAccountId(null);
    },
  });

  // Event handlers
  const handleCreateAccount = () => {
    const newAccount = {
      "user-name": "New Account",
      email: "new@example.com",
      "phone-number": "0123456789",
      address: "test address",
      status: "ACTIVE",
      avatar: "https://github.com/shadcn.png",
      "merchant-id": "",
      role: "CUSTOMER",
      password: "Test@123"
    };
    createAccountMutation.mutate(newAccount);
  };


  const handleUpdateAccount = () => {
    if (selectedAccountId && selectedAccountQuery.data) {
      const updatedAccount = {
        ...selectedAccountQuery.data.data,
        username: `${selectedAccountQuery.data.data["user-name"]} (Updated)`,
      };
      updateAccountMutation.mutate(updatedAccount);
    }
  };

  const handleDeleteAccount = () => {
    if (selectedAccountId) {
      deleteAccountMutation.mutate(selectedAccountId);
    }
  };

  if (accountsQuery.isLoading) return <LoadingPage />;
  if (accountsQuery.isError) return <div>Error loading accounts</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>

      {/* Account List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Accounts</h2>
        {accounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <ul className="space-y-2">
            {accounts.map((account) => (
              <li
                key={account._id}
                className={`cursor-pointer ${
                  selectedAccountId === account._id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedAccountId(account.id)}
              >
                {account["user-name"]} ({account.email})
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="mr-2 px-2 py-1 bg-gray-200 rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((old) => old + 1)}
            disabled={accounts.length < pageSize}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Account Details */}
      {selectedAccountId && selectedAccountQuery.data && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Selected Account</h2>
          <p>Name: {selectedAccountQuery.data.data["user-name"]}</p>
          <p>Email: {selectedAccountQuery.data.data.email}</p>
        </div>
      )}

      {/* CRUD Operations */}
      <div className="space-x-2">
        <button
          onClick={handleCreateAccount}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Account
        </button>
        <button
          onClick={handleUpdateAccount}
          disabled={!selectedAccountId}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Update Selected Account
        </button>
        <button
          onClick={handleDeleteAccount}
          disabled={!selectedAccountId}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Delete Selected Account
        </button>
      </div>
    </div>
  );
}