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
  filterColumn?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn
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
      {filterColumn && (
        <Input
          placeholder={`Filter ${filterColumn}...`}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      )}
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
// import { IconCirclePlus } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   filterColumn?: string
//   createButton?: React.ReactNode
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   filterColumn,
//   createButton
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
//       <div className='flex items-center gap-2'>
//         {filterColumn && (
//           <Input
//             placeholder={`Filter ${filterColumn}...`}
//             value={
//               (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
//             }
//             onChange={event =>
//               table.getColumn(filterColumn)?.setFilterValue(event.target.value)
//             }
//             className='max-w-sm'
//           />
//         )}
//         {createButton}
//       </div>
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
//           className='max-w-sm'
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

// 'use client'

// import * as React from 'react'
// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   type SortingState,
//   getSortedRowModel,
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
// import { Button } from '@/components/ui/button'
// import { IconPlus } from '@tabler/icons-react'
// import Link from 'next/link'

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   filterColumn?: string
//   createLink?: string
//   createLabel?: string
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   filterColumn,
//   createLink,
//   createLabel
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
//       <div className='flex items-center justify-between'>
//         {filterColumn && (
//           <Input
//             placeholder={`Filter ${filterColumn}...`}
//             value={
//               (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
//             }
//             onChange={event =>
//               table.getColumn(filterColumn)?.setFilterValue(event.target.value)
//             }
//             className='max-w-sm'
//           />
//         )}
//         {createLink && (
//           <Button asChild>
//             <Link href={createLink}>
//               <IconPlus className='mr-2 h-4 w-4' />
//               {createLabel || 'Create'}
//             </Link>
//           </Button>
//         )}
//       </div>
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

// import type * as React from 'react'
// import Link from 'next/link'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { Button } from '@/components/ui/button'
// import { IconDotsVertical } from '@tabler/icons-react'

// interface DataTableProps<T> {
//   data: T[]
//   columns: {
//     header: string
//     accessorKey: keyof T
//     cell?: (item: T) => React.ReactNode
//   }[]
//   onEdit: (item: T) => void
//   onDelete: (item: T) => void
//   detailsPath: string
// }

// export function DataTable<T extends { id: string | number }>({
//   data,
//   columns,
//   onEdit,
//   onDelete,
//   detailsPath
// }: DataTableProps<T>) {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           {columns.map(column => (
//             <TableHead key={column.accessorKey as string}>
//               {column.header}
//             </TableHead>
//           ))}
//           <TableHead>Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {data.map(item => (
//           <TableRow key={item.id}>
//             {columns.map(column => (
//               <TableCell key={column.accessorKey as string}>
//                 {column.cell
//                   ? column.cell(item)
//                   : (item[column.accessorKey] as React.ReactNode)}
//               </TableCell>
//             ))}
//             <TableCell>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant='ghost' className='h-8 w-8 p-0'>
//                     <IconDotsVertical className='h-4 w-4' />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align='end'>
//                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                   <DropdownMenuItem asChild>
//                     <Link href={`${detailsPath}/${item.id}`}>View</Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => onEdit(item)}>
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => onDelete(item)}>
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   )
// }
