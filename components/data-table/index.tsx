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
// import { Filter } from './filter'
import { cn } from '@/lib/utils'

export function DataTable<TData, TValue>({
  columns,
  data
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedColumn, setSelectedColumn] = React.useState<string>('')
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
    },
    filterFns: {
      custom: (row, columnId, filterValue) => {
        const value = row.getValue(columnId)
        if (typeof value === 'number') {
          return value.toString().includes(filterValue)
        }
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filterValue.toLowerCase())
        }
        return false
      }
    }
  })

  React.useEffect(() => {
    const firstColumn = table
      .getAllColumns()
      .find(
        column =>
          typeof column.accessorFn !== 'undefined' &&
          !['select', 'actions'].includes(column.id)
      )
    if (firstColumn && !selectedColumn) {
      setSelectedColumn(firstColumn.id)
    }
  }, [table, selectedColumn])

  return (
    <div className='w-full'>
      <div className='flex items-center gap-3 py-4'>
        <Input
          placeholder={
            selectedColumn ? `Filter by ${selectedColumn}...` : 'Filter...'
          }
          value={
            (table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table.getColumn(selectedColumn)?.setFilterValue(event.target.value)
          }
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
          <DropdownMenuContent
            align='end'
            sticky='partial'
            className='w-[100px]'
            collisionPadding={12}
            side='bottom'
            updatePositionStrategy='always'
          >
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
            {/* <Filter table={table} /> */}
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
