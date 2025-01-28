'use client'

import { Columns } from './columns'
import { DataTable } from '.'

export function Table<T extends object>({ data }: { data: T[] }) {
  const columns = Columns(data)

  return <DataTable columns={columns} data={data} />
}
