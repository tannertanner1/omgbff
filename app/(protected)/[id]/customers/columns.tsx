'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import type { NewCustomer } from '@/db/schema/invoices'
import { formatDistanceToNow } from 'date-fns'

export const columns: ColumnDef<NewCustomer & { id: number }>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/customers/${row.original.id}`}
        className='hover:underline'
      >
        {row.getValue('name')}
      </Link>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email'
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

// "use client"

// import Link from "next/link"
// import type { ColumnDef } from "@tanstack/react-table"
// import type { Customer } from "@/db/schema/invoices"
// import { formatDistanceToNow } from "date-fns"

// export const columns: ColumnDef<Customer>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => (
//       <Link href={`/${row.original.userId}/customers/${row.original.id}`} className="hover:underline">
//         {row.getValue("name")}
//       </Link>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "createdAt",
//     header: "Created",
//     cell: ({ row }) => formatDistanceToNow(new Date(row.getValue("createdAt")), { addSuffix: true }),
//   },
// ]
