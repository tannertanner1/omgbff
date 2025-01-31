'use client'

import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader
} from '@/components/ui/table'
import { IconDotsCircleHorizontal, IconCheck } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Options } from './options'
import { Pagination } from './pagination'
import { cn } from '@/lib/utils'

export function DataTable<TData, TValue>({
  columns,
  data,
  link
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
  const [selectedColumn, setSelectedColumn] = React.useState('')
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)

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

  React.useEffect(() => {
    if (selectedColumn === '') {
      const firstColumn = table
        .getAllColumns()
        .find(
          column =>
            typeof column.accessorFn !== 'undefined' &&
            !['select', 'actions'].includes(column.id)
        )
      if (firstColumn) {
        setSelectedColumn(firstColumn.id)
      }
    }
  }, [table, selectedColumn])

  const currentColumn = selectedColumn ? table.getColumn(selectedColumn) : null
  const filterValue = currentColumn?.getFilterValue() as string

  return (
    <div className='w-full'>
      <div className='flex items-center gap-3 py-4'>
        <Input
          placeholder={
            selectedColumn ? `Filter by ${selectedColumn}...` : 'Filter...'
          }
          value={filterValue ?? ''}
          onChange={event => {
            if (currentColumn) {
              currentColumn.setFilterValue(event.target.value)
            }
          }}
          className='w-full'
        />
        <DropdownMenu open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              aria-label='Table options'
              className={cn('group rounded-full transition-colors')}
            >
              <IconDotsCircleHorizontal
                className={cn(
                  'h-6 w-6 transition-colors',
                  isOptionsOpen
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary'
                )}
              />
              <span className='sr-only'>Table options</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[200px]'>
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
                      column =>
                        typeof column.accessorFn !== 'undefined' &&
                        !['select', 'actions'].includes(column.id)
                    )
                    .map(column => (
                      <DropdownMenuRadioItem
                        key={column.id}
                        value={column.id}
                        className='capitalize'
                      >
                        {column.id}
                      </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Rows</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <DropdownMenuItem
                    key={pageSize}
                    onClick={() => table.setPageSize(pageSize)}
                    className='flex items-center justify-between'
                  >
                    <span>{pageSize}</span>
                    {table.getState().pagination.pageSize === pageSize && (
                      <IconCheck className='ml-auto h-4 w-4' />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <Options table={table} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className='px-4'>
                    {header.isPlaceholder ? null : (
                      <div className='flex items-center'>
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(link && 'cursor-pointer hover:bg-muted')}
                  onClick={e => {
                    // Don't navigate if clicking action buttons
                    if (
                      (e.target as HTMLElement).closest('[data-action-trigger]')
                    ) {
                      return
                    }
                    if (link) {
                      window.location.href = link(row.original)
                    }
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='p-0'>
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
      <Pagination table={table} />
    </div>
  )
}

/**
 * @see https://github.com/sadmann7/shadcn-table/tree/8b70d2e761ca9d8f0a9302ea0e15c196086883d5/src/components/data-table
 * @see https://github.com/shadcn-ui/ui/tree/805ed4120a6a8ae6f6e9714cbd776e18eeba92c7/apps/www/app/(app)/examples/tasks/components
 */
