'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'

type Organization = {
  id: string
  name: string
  createdAt: Date
}

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/organizations/${row.original.id}`}
        className='hover:underline'
      >
        {row.getValue('name')}
      </Link>
    )
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
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'
// import { Form } from './form'

// export type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// export const columns: ColumnDef<Organization>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => {
//       const value = row.getValue('name') as string
//       const id = row.original.id
//       return (
//         <Link href={`/organizations/${id}`} className='hover:underline'>
//           {value}
//         </Link>
//       )
//     }
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) => {
//       const date = row.getValue('createdAt') as Date
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       return (
//         <Form
//           userId={row.original.id}
//           organization={{
//             id: row.original.id,
//             name: row.getValue('name') as string
//           }}
//         />
//       )
//     }
//   }
// ]

// 'use client'

// import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'
// import type { ColumnDef } from '@tanstack/react-table'

// export type Organization = {
//   id: string
//   name: string
//   createdAt: Date
// }

// export const columns: ColumnDef<Organization>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => {
//       const value = row.getValue('name') as string
//       const id = row.original.id
//       return (
//         <Link href={`/organizations/${id}`} className='hover:underline'>
//           {value}
//         </Link>
//       )
//     }
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) => {
//       const date = row.getValue('createdAt') as Date
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
//   }
// ]
