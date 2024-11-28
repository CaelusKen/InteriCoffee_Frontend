"use client"

import React, { useState } from 'react'
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
import { useAccessToken } from '@/hooks/use-access-token'

const fetchCategory = async(accessToken: string) : Promise<ApiResponse<PaginatedResponse<ProductCategory>>> => {
    return api.getPaginated<ProductCategory>('product-categories', undefined, accessToken)
}

const deleteCategory = async(id: string, accessToken: string) : Promise<ApiResponse<ProductCategory>> => {
    return api.delete<ProductCategory>(`product-categories/${id}`, accessToken)
}

export default function MerchantProductCategoryTable() {
    const [page, setPage] = useState(1)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const queryClient = useQueryClient()
    const [selectedProductCategoryId, setSelectedProductCategoryId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const { toast } = useToast()
  
    const router = useRouter()

    const accessToken = useAccessToken()

    const productCategoriesQuery = useQuery({
        queryKey: ['product-categories'],
        queryFn: () => fetchCategory(accessToken ?? '')
    })

    const deleteProductCategoryMutation = useMutation({
        mutationFn: (id: string) => deleteCategory( id, accessToken ?? ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-categories'] })
            setSelectedProductCategoryId(null)
            setIsDeleteDialogOpen(false)
            toast({
                title: "Product Category Removed",
                description: "The product category has been successfully removed.",
                className: "bg-green-500"
            })
        },
        onError: (error) => {
            console.error('Error deleting product:', error)
            toast({
              title: "Error",
              description: `An error occurred while deleting the product category. ${error}`,
              variant: "destructive",
            })
        },
    })

    const handleDeleteProductCategory = () => {
        if (selectedProductCategoryId) {
          deleteProductCategoryMutation.mutate(selectedProductCategoryId)
        }
    }

    const productCategories = productCategoriesQuery.data?.data.items ?? []
    const totalCount = productCategoriesQuery.data?.data?.totalCount ?? 0
    const pageSize = productCategoriesQuery.data?.data?.pageSize ?? 10

    const columns: ColumnDef<ProductCategory>[] = [
        {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        }, 
        {
            accessorKey: "description",
            header: "Description"
        },
        {
            id: "actions",
            cell: ({ row }) => {
              const productCategory = row.original
      
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
                    <DropdownMenuItem onClick={() => router.push(`/merchant/product-categories/${productCategory.id}/update`)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedProductCategoryId(productCategory.id)
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
        data: productCategories,
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

    if (productCategoriesQuery.isLoading) return <LoadingPage />
    if (productCategoriesQuery.isError) return <div>Error loading product categories</div>

    return (
        <section className="space-y-4">
      <h1 className="text-2xl font-bold">Product Categories Management</h1>

      <div className="flex items-center gap-2">
        <Button onClick={() => router.push('/merchant/product-categories/create')} className="bg-green-500 hover:bg-green-700 text-white">
          <Package size={16}/>
          Create product category
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search product categories..."
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
            <DialogTitle>Are you sure you want to delete this category?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the category from our servers.
              (we seriously mean it!!!)
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProductCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
    )
}
