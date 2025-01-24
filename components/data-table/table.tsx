'use client'

import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchColumn?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    }
  })

  return (
    <div className='space-y-4'>
      {searchColumn && (
        <Input
          placeholder={searchPlaceholder || `Filter ${searchColumn}...`}
          value={
            (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
          }
          className='max-w-sm border-gray-800 bg-black text-white'
        />
      )}
      <div className='rounded-md border border-gray-800'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='border-gray-800'>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className='text-gray-400'>
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
                  className='border-gray-800'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='text-white'>
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
                  className='h-24 text-center text-gray-400'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// 'use client'

// import * as React from 'react'
// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getSortedRowModel,
//   type SortingState,
//   type ColumnFiltersState,
//   getFilteredRowModel
// } from '@tanstack/react-table'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { Input } from '@/components/ui/input'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   filterColumn?: string
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   filterColumn
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   )

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       sorting,
//       columnFilters
//     }
//   })

//   return (
//     <div className='space-y-4'>
//       {filterColumn && (
//         <Input
//           placeholder={`Filter ${filterColumn}...`}
//           value={
//             (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
//           }
//           onChange={event =>
//             table.getColumn(filterColumn)?.setFilterValue(event.target.value)
//           }
//           className='w-full'
//         />
//       )}
//       <div className='rounded-md border'>
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map(headerGroup => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
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
//     </div>
//   )
// }
