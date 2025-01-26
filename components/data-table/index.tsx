'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Pagination } from './pagination'
import { Toolbar } from './toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  filterColumn?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  filterColumn,
  searchPlaceholder
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount: pageCount
  })

  return (
    <div className='space-y-4'>
      <Toolbar
        table={table}
        filterColumn={filterColumn}
        searchPlaceholder={searchPlaceholder}
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
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
      <Pagination table={table} />
    </div>
  )
}

// 'use client'

// import * as React from 'react'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   type SortingState,
//   type VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable
// } from '@tanstack/react-table'

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { Pagination } from './pagination'
// import { Toolbar } from './toolbar'
// import { Filter } from './filter'

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   pageCount,
//   filterableColumns = [],
//   searchableColumns = []
// }: {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   pageCount: number
//   filterableColumns?: {
//     id: string
//     title: string
//     options: {
//       label: string
//       value: string
//       icon?: React.ComponentType<{ className?: string }>
//     }[]
//   }[]
//   searchableColumns?: {
//     id: string
//     title: string
//   }[]
// }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()

//   // URL state
//   const page = searchParams?.get('page') ? Number(searchParams.get('page')) : 1
//   const perPage = searchParams?.get('per_page')
//     ? Number(searchParams.get('per_page'))
//     : 10
//   const sort = searchParams?.get('sort')
//   const [column, order] = sort?.split('.') ?? []

//   // Table state
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({})
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   )

//   // Handle server-side sorting
//   const [sorting, setSorting] = React.useState<SortingState>([
//     {
//       id: column ?? '',
//       desc: order === 'desc'
//     }
//   ])

//   // Create query string
//   const createQueryString = React.useCallback(
//     (params: Record<string, string | number | null>) => {
//       const newSearchParams = new URLSearchParams(searchParams?.toString())

//       for (const [key, value] of Object.entries(params)) {
//         if (value === null) {
//           newSearchParams.delete(key)
//         } else {
//           newSearchParams.set(key, String(value))
//         }
//       }

//       return newSearchParams.toString()
//     },
//     [searchParams]
//   )

//   const table = useReactTable({
//     data,
//     columns,
//     pageCount: pageCount,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination: {
//         pageIndex: page - 1,
//         pageSize: perPage
//       }
//     },
//     enableRowSelection: true,
//     manualPagination: true,
//     manualSorting: true,
//     manualFiltering: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: updater => {
//       const newSorting =
//         typeof updater === 'function' ? updater(sorting) : updater
//       setSorting(newSorting)

//       if (newSorting.length === 0) {
//         router.push(`${pathname}?${createQueryString({ sort: null })}`)
//         return
//       }

//       const [{ id, desc }] = newSorting
//       router.push(
//         `${pathname}?${createQueryString({
//           sort: `${id}.${desc ? 'desc' : 'asc'}`
//         })}`
//       )
//     },
//     onPaginationChange: updater => {
//       const newPagination =
//         typeof updater === 'function'
//           ? updater({ pageIndex: page - 1, pageSize: perPage })
//           : updater

//       router.push(
//         `${pathname}?${createQueryString({
//           page: newPagination.pageIndex + 1,
//           per_page: newPagination.pageSize
//         })}`
//       )
//     },
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues()
//   })

//   return (
//     <div className='space-y-4'>
//       <Toolbar table={table} />
//       <Filter
//         filterableColumns={filterableColumns}
//         searchableColumns={searchableColumns}
//       />
//       <div className='rounded-md border'>
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map(headerGroup => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder ? null : (
//                       <div
//                         {...{
//                           className: header.column.getCanSort()
//                             ? 'cursor-pointer select-none'
//                             : '',
//                           onClick: header.column.getToggleSortingHandler()
//                         }}
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                       </div>
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map(row => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && 'selected'}
//                 >
//                   {row.getVisibleCells().map(cell => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className='h-24 text-center'
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <Pagination table={table} />
//     </div>
//   )
// }
