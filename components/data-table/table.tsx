'use client'

import { DataTable } from '.'
import type { ColumnDef } from '@tanstack/react-table'

export function Table<TData extends object>({
  data,
  columns,
  link
}: {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  link?: (row: TData) => string
}) {
  return <DataTable columns={columns} data={data} link={link} />
}

// 'use client'

// import { Columns } from './columns'
// import { DataTable } from '.'
// import type { ColumnDef } from '@tanstack/react-table'

// export function Table<TData extends object>({
//   data,
//   columns,
//   link
// }: {
//   data: TData[]
//   columns?: ColumnDef<TData, any>[]
//   link?: (row: TData) => string
// }) {
//   const tableColumns = columns || Columns(data)
//   return <DataTable columns={tableColumns} data={data} link={link} />
// }

// 'use client'

// import { Columns } from './columns'
// import { DataTable } from '.'
// import type { ColumnDef } from '@tanstack/react-table'

// interface TableProps<TData extends object> {
//   data: TData[]
//   columns?: ColumnDef<TData, any>[]
// }

// export function Table<TData extends object>({
//   data,
//   columns
// }: TableProps<TData>) {
//   // Use provided columns or generate them automatically
//   const tableColumns = columns || Columns(data)
//   return <DataTable columns={tableColumns} data={data} />
// }

// 'use client'

// import { Columns } from './columns'
// import { DataTable } from '.'

// export function Table<TData extends object>({ data }: { data: TData[] }) {
//   const columns = Columns(data)
//   return <DataTable columns={columns} data={data} />
// }
