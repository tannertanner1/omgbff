'use client'

import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type VisibilityState
} from '@tanstack/react-table'
import {
  IconCircleChevronLeft,
  IconCircleChevronRight,
  IconCircleHalf,
  IconCheck
} from '@tabler/icons-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Options } from './options'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn = 'email',
  filterPlaceholder = 'Filter emails...'
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [open, setOpen] = React.useState(false)

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
      rowSelection
    }
  })

  const hasResults = table.getFilteredRowModel().rows.length > 0

  return (
    <div className='w-full'>
      <div className='flex items-center gap-3 py-4'>
        <div className='relative flex-1'>
          <Input
            placeholder={filterPlaceholder}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={event =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className='w-full'
          />
        </div>
        <Options table={table} />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader className={cn('hover:bg-transparent')}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
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
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button aria-label='Toggle page size'>
                <IconCircleHalf className='flex h-6 w-6 rotate-90 items-center' />
              </button>
            </PopoverTrigger>
            <PopoverContent align='start' className='w-[70px] p-0'>
              <Command>
                <CommandList>
                  <CommandGroup>
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <CommandItem
                        key={pageSize}
                        onSelect={() => {
                          table.setPageSize(Number(pageSize))
                          setOpen(false)
                        }}
                        className='flex items-center justify-between'
                      >
                        <span>{pageSize}</span>
                        {table.getState().pagination.pageSize === pageSize && (
                          <IconCheck className='h-4 w-4' />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center [&_button]:flex [&_button]:items-center [&_button]:justify-center'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() =>
                hasResults && table.getCanPreviousPage() && table.previousPage()
              }
              className='flex h-6 w-6 items-center justify-center'
              disabled={!hasResults || !table.getCanPreviousPage()}
              aria-label='Previous page'
            >
              <IconCircleChevronLeft
                className='h-6 w-6'
                style={{
                  opacity:
                    !hasResults || !table.getCanPreviousPage() ? 0.25 : 0.5
                }}
              />
            </button>
            <button
              onClick={() =>
                hasResults && table.getCanNextPage() && table.nextPage()
              }
              className='flex h-6 w-6 items-center justify-center'
              disabled={!hasResults || !table.getCanNextPage()}
              aria-label='Next page'
            >
              <IconCircleChevronRight
                className='h-6 w-6'
                style={{
                  opacity: !hasResults || !table.getCanNextPage() ? 0.25 : 0.5
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
