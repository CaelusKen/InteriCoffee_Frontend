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
} from "@tanstack/react-table"
import { Style } from "@/types/frontend/entities"
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
import { Input } from "@/components/ui/input"
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
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAccessToken } from "@/hooks/use-access-token"

const deleteStyle = async (id: string): Promise<ApiResponse<Style>> => {
  return api.delete<Style>(`styles/${id}`)
}

const fetchStyles = async (accessToken: string): Promise<ApiResponse<PaginatedResponse<Style>>> => {
  return api.getPaginated<Style>("styles", undefined, accessToken)
}

export default function MerchantStylesTable() {
  const [page, setPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])

  const accessToken = useAccessToken()

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)

  const router = useRouter();
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const stylesQuery = useQuery({
    queryKey: ["styles", page],
    queryFn: () => fetchStyles(accessToken ?? ''),
  })

  const styles = stylesQuery.data?.data?.items ?? []
  const totalCount = stylesQuery.data?.data?.totalCount ?? 0
  const pageSize = stylesQuery.data?.data?.pageSize ?? 10

  const deleteStyleMutation = useMutation({
    mutationFn: (styleId: string) => api.delete(`styles/${styleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] })
      setIsDeleteDialogOpen(false)
      toast({
        title: "Style deleted",
        description: "The style has been successfully deleted.",
        variant: "destructive",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the style.",
        variant: "destructive",
      })
    },
  })

  const handleDeleteStyle = () => {
    if (selectedStyleId) {
      deleteStyleMutation.mutate(selectedStyleId)
    }
  }

  const columns: ColumnDef<Style>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Style Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Style Description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const style = row.original

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
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(style.id)}
              >
                Copy style ID
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => router.push(`/merchant/styles/${style.id}/update`)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedStyleId(style.id)
                setIsDeleteDialogOpen(true)
              }}>Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: styles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (stylesQuery.isLoading) return <LoadingPage />
  if (stylesQuery.isError) return <div>Error loading styles</div>

  return (
    <section className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Styles Management</h1>
          <p className="text-sm text-muted-foreground">
            (Note: Styles are special categories that define unique Interior Design concepts)
          </p>
        </div>
        <Button onClick={() => router.push('/merchant/styles/create')}>Add New Style</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
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
                  No styles found.
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
            <DialogTitle>Are you sure you want to delete this style?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStyle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}