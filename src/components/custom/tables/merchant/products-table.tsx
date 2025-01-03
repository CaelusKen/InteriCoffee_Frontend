"use client"

import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
} from "@tanstack/react-table"
import { Product, ProductCategory } from "@/types/frontend/entities"
import { ApiResponse, PaginatedResponse } from "@/types/api"
import { api } from "@/service/api"
import LoadingPage from "@/components/custom/loading/loading"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Archive, ArrowUpDown, MoreHorizontal, Package } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAccessToken } from "@/hooks/use-access-token"

const fetchProducts = async (accessToken: string): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.getPaginated<Product>("products", undefined, accessToken)
}

const fetchCategory = async(accessToken: string) : Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
  return api.getPaginated<ProductCategory>('product-categories', undefined, accessToken)
}

const deleteProduct = async (id: string, accessToken: string): Promise<ApiResponse<Product>> => {
  return api.delete<Product>(`products/${id}`, accessToken ?? '')
}

export default function MerchantProductsTable() {
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const queryClient = useQueryClient()
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const router = useRouter()

  const accessToken = useAccessToken()

  const productsQuery = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(accessToken ?? ''),
  })

  const productCategoriesQuery = useQuery({
    queryKey: ["product-categories", page],
    queryFn: () => fetchCategory(accessToken ?? '')
  })

  const deleteProductMutation = useMutation({
    mutationFn:(id: string) => deleteProduct(id, accessToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setSelectedProductId(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
        className: "bg-green-500"
      })
    },
    onError: (error) => {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: `An error occurred while deleting the product ${error}`,
        variant: "destructive",
      })
    },
  })

  const handleDeleteProduct = () => {
    if (selectedProductId) {
      deleteProductMutation.mutate(selectedProductId)
    }
  }

  const products = productsQuery.data?.data?.items ?? []
  const totalCount = productsQuery.data?.data?.totalCount ?? 0
  const pageSize = productsQuery.data?.data?.pageSize ?? 20

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
      cell: ({ row }) => `${row.original.sellingPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND"})}`,
    },
    {
      accessorKey: "quantity",
      header: "Quantity In Stock",
      cell: ({ row }) => `${row.original.quantity} item(s)`,
    },
    {
      accessorKey: "dimensions",
      header: "Dimensions",
    },
    // {
    //   accessorKey: "createdDate",
    //   header: "Created Date",
    //   cell: ({ row }) => row.original.createdDate.toDateString(),
    // },
    {
      accessorKey: "categoryIds",
      header: "Categories",
      cell: ({ row }) => {
        const productCategories = productCategoriesQuery.data?.data.items ?? []
        const product = row.original
        
        const currentProductCategoryNames = product.categoryIds
          .map(categoryId => productCategories.find(category => category.id === categoryId)?.name)
          .filter(Boolean)

        return (
          <div className="flex flex-wrap gap-1">
            {currentProductCategoryNames.map((categoryName, index) => (
              <span key={index} className="px-2 py-1 bg-gray-200 text-black rounded-full text-xs">
                {categoryName}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

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
              <DropdownMenuItem onClick={() => router.push(`/merchant/products/${product.id}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/merchant/products/${product.id}/update`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedProductId(product.id)
                setIsDeleteDialogOpen(true)
              }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  if (productsQuery.isLoading) return <LoadingPage />
  if (productsQuery.isError) return <div>Error loading products</div>

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Product Management</h1>

      <div className="flex items-center gap-2">
        <Button onClick={() => router.push('/merchant/products/create')} className="bg-green-500 hover:bg-green-700 text-white">
          <Package size={16}/>
          Create product
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}