'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DataTableColumnProps<T extends { id: string | number }> {
  getValue: (row: T, key: keyof T) => any
  formatValue?: (value: any) => string
  linkPrefix?: string | ((row: T) => string)
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function createColumn<T extends { id: string | number }>({
  accessorKey,
  header,
  getValue,
  formatValue,
  linkPrefix = '',
  className = '',
  align = 'left'
}: {
  accessorKey: keyof T
  header: string
} & DataTableColumnProps<T>): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = getValue(row.original, accessorKey)
      const formattedValue = formatValue ? formatValue(value) : value
      const content = (
        <div
          className={cn('block p-4', className, {
            'text-center': align === 'center',
            'text-right': align === 'right'
          })}
        >
          {formattedValue}
        </div>
      )

      if (linkPrefix) {
        const href =
          typeof linkPrefix === 'function'
            ? linkPrefix(row.original)
            : `${linkPrefix}/${row.original.id}`
        return (
          <Link href={href} className='block'>
            {content}
          </Link>
        )
      }

      return content
    }
  }
}

export function createStatusColumn<T extends { id: string | number }>({
  accessorKey,
  header,
  getValue,
  statuses
}: {
  accessorKey: keyof T
  header: string
  getValue: (row: T, key: keyof T) => string
  statuses: Record<string, { bg: string }>
}): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const status = getValue(row.original, accessorKey)
      return (
        <div className='p-4 text-center'>
          <Badge className={cn('rounded-full capitalize', statuses[status].bg)}>
            {status}
          </Badge>
        </div>
      )
    }
  }
}

// 'use client'

// import Link from 'next/link'
// import type { ColumnDef } from '@tanstack/react-table'
// import { Badge } from '@/components/ui/badge'
// import { cn } from '@/lib/utils'

// interface DataTableColumnProps<T> {
//   getValue: (row: T, key: keyof T) => any
//   formatValue?: (value: any) => string
//   linkPrefix?: string
//   className?: string
//   align?: 'left' | 'center' | 'right'
// }

// export function createColumn<T>({
//   accessorKey,
//   header,
//   getValue,
//   formatValue,
//   linkPrefix = '',
//   className = '',
//   align = 'left'
// }: {
//   accessorKey: keyof T
//   header: string
// } & DataTableColumnProps<T>): ColumnDef<T> {
//   return {
//     accessorKey: accessorKey as string,
//     header,
//     cell: ({ row }) => {
//       const value = getValue(row.original, accessorKey)
//       const formattedValue = formatValue ? formatValue(value) : value
//       const content = (
//         <div
//           className={cn('block p-4', className, {
//             'text-center': align === 'center',
//             'text-right': align === 'right'
//           })}
//         >
//           {formattedValue}
//         </div>
//       )

//       return linkPrefix ? (
//         <Link href={`${linkPrefix}/${row.original.id}`} className='block'>
//           {content}
//         </Link>
//       ) : (
//         content
//       )
//     }
//   }
// }

// export function createStatusColumn<T>({
//   accessorKey,
//   header,
//   getValue,
//   statuses
// }: {
//   accessorKey: keyof T
//   header: string
//   getValue: (row: T, key: keyof T) => string
//   statuses: Record<string, { bg: string }>
// }): ColumnDef<T> {
//   return {
//     accessorKey: accessorKey as string,
//     header,
//     cell: ({ row }) => {
//       const status = getValue(row.original, accessorKey)
//       return (
//         <div className='p-4 text-center'>
//           <Badge className={cn('rounded-full capitalize', statuses[status].bg)}>
//             {status}
//           </Badge>
//         </div>
//       )
//     }
//   }
// }
