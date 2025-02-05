'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'

export function Columns<T extends object>(
  data: T[],
  options?: {
    onEdit?: (row: T) => void
    onDelete?: (row: T) => Promise<void>
  }
): ColumnDef<T>[] {
  if (data.length === 0) return []

  const sample = data[0]
  const columns: ColumnDef<T>[] = Object.keys(sample).map(key => ({
    accessorKey: key,
    header: ({ column }) => (
      <Header
        column={column}
        label={key.charAt(0).toUpperCase() + key.slice(1)}
      />
    ),
    cell: ({ row }) => (
      <div className='px-4'>{row.getValue(key)?.toString()}</div>
    )
  }))

  columns.push({
    id: 'actions',
    cell: ({ row }) => (
      <Actions<T>
        row={row.original}
        onEdit={options?.onEdit}
        onDelete={options?.onDelete}
      />
    )
  })

  return columns
}
