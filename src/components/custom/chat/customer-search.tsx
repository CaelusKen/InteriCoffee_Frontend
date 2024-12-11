"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Account } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useAccessToken } from "@/hooks/use-access-token";

interface CustomerSearchProps {
  onSelectCustomer: (customer: Account) => void;
}

const fetchCustomers = async (
  keyword: string,
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<Account>>> => {
  return api.getPaginated<Account>(
    "accounts",
    { keyword: keyword },
    accessToken
  );
};

export function CustomerSearch({ onSelectCustomer }: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAccessToken();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchCustomers(searchQuery, accessToken ?? "");
      setCustomers(
        response.data.items.filter((item) => item.role === "CUSTOMER")
      );
      console.log(customers)
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-4">
        <h2 className="font-semibold mb-2">Search for Customers</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>
      <ScrollArea className="flex-1">
        {error && <p className="text-red-500 p-4">{error}</p>}
        <div className="p-4 space-y-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback>{customer.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{customer.userName}</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.email}
                  </div>
                </div>
              </div>
              <Button onClick={() => onSelectCustomer(customer)}>Chat</Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
