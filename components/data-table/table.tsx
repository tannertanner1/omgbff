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
