import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export function Column<T extends { id: string | number }>(
  accessorKey: keyof T,
  header: string,
  options: {
    link?: (row: T) => string
    props?: Record<string, any>
    formatter?: (value: unknown) => React.ReactNode
  } = {}
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string)
      const displayValue = options.formatter
        ? options.formatter(value)
        : String(value)
      const content = <div {...options.props}>{displayValue}</div>
      return options.link ? (
        <Link href={options.link(row.original)} className='block w-full'>
          {content}
        </Link>
      ) : (
        content
      )
    }
  }
}
