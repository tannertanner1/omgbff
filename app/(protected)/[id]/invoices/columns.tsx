'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'

type Invoice = {
  id: number
  customerId: number
  customerName: string
  value: number
  status: string
  createdAt: Date
  userId: string
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/customers/${row.original.customerId}`}
        className='hover:underline'
      >
        {row.getValue('customerName')}
      </Link>
    )
  },
  {
    accessorKey: 'value',
    header: 'Amount',
    cell: ({ row }) => {
      const value = row.getValue('value')
      return typeof value === 'number' ? `$${(value / 100).toFixed(2)}` : 'N/A'
    }
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) =>
      formatDistanceToNow(new Date(row.getValue('createdAt')), {
        addSuffix: true
      })
  }
]

// 'use client'

// import Link from 'next/link'
// import type { ColumnDef } from '@tanstack/react-table'
// import { formatDistanceToNow } from 'date-fns'

// type Invoice = {
//   id: number
//   customerId: number
//   customerName: string
//   value: number
//   status: string
//   createdAt: Date
//   userId: string // Add this line
// }

// export const columns: ColumnDef<Invoice>[] = [
//   {
//     accessorKey: 'customerName',
//     header: 'Customer',
//     cell: ({ row }) => (
//       <Link
//         href={`/${row.original.userId}/customers/${row.original.customerId}`}
//         className='hover:underline'
//       >
//         {row.getValue('customerName')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'value',
//     header: 'Amount',
//     cell: ({ row }) => {
//       const value = row.getValue('value')
//       return typeof value === 'number' ? `$${(value / 100).toFixed(2)}` : 'N/A'
//     }
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(new Date(row.getValue('createdAt')), {
//         addSuffix: true
//       })
//   }
// ]

// 'use client'

// import Link from 'next/link'
// import type { ColumnDef } from '@tanstack/react-table'
// import { formatDistanceToNow } from 'date-fns'

// type Invoice = {
//   id: number
//   customerId: number
//   customerName: string
//   value: number
//   status: string
//   createdAt: Date
//   userId: string // Add this line
// }

// export const columns: ColumnDef<Invoice>[] = [
//   {
//     accessorKey: 'customerName',
//     header: 'Customer',
//     cell: ({ row }) => (
//       <Link
//         href={`/${row.original.userId}/customers/${row.original.customerId}`}
//         className='hover:underline'
//       >
//         {row.getValue('customerName')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'value',
//     header: 'Amount',
//     cell: ({ row }) => `$${(row.getValue('value') / 100).toFixed(2)}`
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(new Date(row.getValue('createdAt')), {
//         addSuffix: true
//       })
//   }
// ]

// "use client"

// import Link from "next/link"
// import type { ColumnDef } from "@tanstack/react-table"
// import { formatDistanceToNow } from "date-fns"

// type Invoice = {
//   id: number
//   customerId: number
//   customerName: string
//   value: number
//   status: string
//   createdAt: Date
// }

// export const columns: ColumnDef<Invoice>[] = [
//   {
//     accessorKey: "customerName",
//     header: "Customer",
//     cell: ({ row }) => (
//       <Link href={`/${row.original.userId}/customers/${row.original.customerId}`} className="hover:underline">
//         {row.getValue("customerName")}
//       </Link>
//     ),
//   },
//   {
//     accessorKey: "value",
//     header: "Amount",
//     cell: ({ row }) => `$${(row.getValue("value") / 100).toFixed(2)}`,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Created",
//     cell: ({ row }) => formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true }),
//   },
// ]
