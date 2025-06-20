"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  IconCheck,
  IconDotsCircleHorizontal,
  IconMoodEmpty,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Options } from "./options"
import { Pagination } from "./pagination"

export function DataTable<TData, TValue>({
  columns,
  data,
  link,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  link?: (row: TData) => string
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedColumn, setSelectedColumn] = React.useState("")
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    if (selectedColumn === "") {
      const firstColumn = table
        .getAllColumns()
        .find(
          (column) =>
            typeof column.accessorFn !== "undefined" &&
            !["select", "actions"].includes(column.id)
        )
      if (firstColumn) {
        setSelectedColumn(firstColumn.id)
      }
    }
  }, [table, selectedColumn])

  const currentColumn = selectedColumn ? table.getColumn(selectedColumn) : null
  const filterValue = currentColumn?.getFilterValue() as string

  // Helper function to get column label
  const getColumnLabel = (column: any) => {
    if (typeof column.columnDef.header === "string") {
      return column.columnDef.header
    }
    if (typeof column.columnDef.header === "function") {
      const headerProps = { column } // Minimal props needed for the header function
      const headerContent = column.columnDef.header(headerProps)
      // If it's a React element with a label prop, try to extract it
      if (headerContent?.props?.label) {
        return headerContent.props.label
      }
    }
    // Fallback to formatted column ID if no header is found
    return column.id.charAt(0).toUpperCase() + column.id.slice(1)
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 py-4">
        <Input
          placeholder={
            selectedColumn
              ? `Filter by ${getColumnLabel(currentColumn)}...`
              : "Filter..."
          }
          value={filterValue ?? ""}
          onChange={(event) => {
            if (currentColumn) {
              currentColumn.setFilterValue(event.target.value)
            }
          }}
          className="border-input [&[data-slot=input]]:focus-visible:border-input [&[data-slot=input]]:dark:bg-background w-full [&[data-slot=input]]:focus-visible:ring-0 [&[data-slot=input]]:dark:focus-visible:ring-0"
        />
        <DropdownMenu open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "group h-8 w-8 p-0 transition-colors",
                "focus:ring-0 focus:outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                isOptionsOpen && "bg-accent text-accent-foreground"
              )}
            >
              <IconDotsCircleHorizontal className="size-5 transition-colors" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Filter</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={selectedColumn}
                  onValueChange={setSelectedColumn}
                >
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        !["select", "actions"].includes(column.id)
                    )
                    .map((column) => (
                      <DropdownMenuRadioItem
                        key={column.id}
                        value={column.id}
                        className="capitalize"
                      >
                        {getColumnLabel(column)}
                      </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Rows</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <DropdownMenuItem
                    key={pageSize}
                    onClick={() => table.setPageSize(pageSize)}
                    className="flex items-center justify-between"
                  >
                    <span>{pageSize}</span>
                    {table.getState().pagination.pageSize === pageSize && (
                      <IconCheck className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <Options table={table} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto rounded-md border [&_[data-slot=table-row]]:hover:bg-transparent">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
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
                  className={cn(link && "cursor-pointer")}
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    // Only navigate if not clicking an action button or its container
                    if (
                      !target.closest("[data-action-trigger]") &&
                      !target.closest('[role="menuitem"]') &&
                      link
                    ) {
                      const url = link(row.original)
                      const returnTo = encodeURIComponent(pathname)
                      router.push(`${url}?returnTo=${returnTo}`)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-1">
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
                  <div className="text-muted-foreground flex items-center justify-center">
                    <IconMoodEmpty className="h-6 w-6" />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  )
}
