'use client'

import { Columns } from './columns'
import { DataTable } from '.'

export function Table<TData extends object>({ data }: { data: TData[] }) {
  const columns = Columns(data)
  return <DataTable columns={columns} data={data} />
}
