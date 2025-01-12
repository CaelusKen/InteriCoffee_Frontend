"use client";

import { useState, useMemo } from "react";
import TemplateCard from "@/components/custom/cards/default-template-card";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { api } from "@/service/api";
import { Merchant, Style, Template } from "@/types/frontend/entities";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "@/components/custom/loading/loading";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAccessToken } from "@/hooks/use-access-token";

const fetchTemplates = async (
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<Template>>> => {
  return api.getPaginated<Template>("templates", undefined, accessToken);
};

const fetchStyles = async (
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<Style>>> => {
  return api.getPaginated<Style>("styles", undefined, accessToken);
};

const fetchMerchants = async (
  accessToken: string
): Promise<ApiResponse<PaginatedResponse<Merchant>>> => {
  return api.getPaginated<Merchant>("merchants", undefined, accessToken);
};

export default function TemplateGallery() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState<string | undefined>();
  const [selectedMerchantId, setSelectedMerchantId] = useState<
    string | undefined
  >();

  const accessToken = useAccessToken();

  const router = useRouter();
  const { toast } = useToast();

  const templateQuery = useQuery({
    queryKey: ["template"],
    queryFn: () => fetchTemplates(accessToken ?? ""),
  });

  const styleQuery = useQuery({
    queryKey: ["style"],
    queryFn: () => fetchStyles(accessToken ?? ""),
  });

  const merchantQuery = useQuery({
    queryKey: ["merchant"],
    queryFn: () => fetchMerchants(accessToken ?? ""),
  });

  const templates = templateQuery.data?.data?.items ?? [];
  const styles = styleQuery.data?.data?.items ?? [];
  const merchants = merchantQuery.data?.data?.items ?? [];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStyle =
        !selectedStyleId || template.styleId === selectedStyleId;
      const matchesMerchant =
        !selectedMerchantId || template.merchantId === selectedMerchantId;
      return matchesSearch && matchesStyle && matchesMerchant;
    });
  }, [templates, searchTerm, selectedStyleId, selectedMerchantId]);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (pageNo - 1) * pageSize;
    return filteredTemplates.slice(startIndex, startIndex + pageSize);
  }, [filteredTemplates, pageNo, pageSize]);

  const totalPages = Math.ceil(filteredTemplates.length / pageSize);

  const handleSave = (id: string) => {
    // Implement save logic here
    toast({
      title: "Template Saved",
      description: `Template with ID ${id} has been saved.`,
    });
  };

  const handleViewDetails = (id: string) => {
    router.push(`/templates/${id}`);
  };

  if (
    templateQuery.isLoading ||
    styleQuery.isLoading ||
    merchantQuery.isLoading
  )
    return <LoadingPage />;
  if (templateQuery.isError || styleQuery.isError || merchantQuery.isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-xl">
          Error loading data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <span className="flex flex-col mb-4">
        <h3 className="text-lg sm:text-xl text-left py-2">Template</h3>
        <h1 className="text-3xl sm:text-5xl md:text-7xl uppercase font-bold text-left py-2">
          Gallery
        </h1>
      </span>
      <div className="flex flex-col sm:flex-row gap-4 my-4">
        <Input
          type="text"
          placeholder="Search templates"
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedStyleId}
          onValueChange={(value) =>
            setSelectedStyleId(value === "All" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Styles</SelectItem>
            {styles.map((style) => (
              <SelectItem key={style.id} value={style.id}>
                {style.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedMerchantId}
          onValueChange={(value) =>
            setSelectedMerchantId(value === "All" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Merchant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Merchants</SelectItem>
            {merchants.map((merchant) => (
              <SelectItem key={merchant.id} value={merchant.id}>
                {merchant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedTemplates.map((template, index) => (
          <TemplateCard
            key={index}
            template={template}
            onSave={() => handleSave(template.id)}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
          disabled={pageNo === 1}
        >
          Previous
        </Button>
        <span>
          Page {pageNo} of {totalPages}
        </span>
        <Button
          onClick={() => setPageNo((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageNo === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
