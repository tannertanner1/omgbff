'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export interface Organization {
  id: string
  name: string
  createdAt: Date
  userId: string
}

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/organizations/${row.original.id}`}
        className='block w-full'
      >
        {row.getValue('name')}
      </Link>
    )
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/organizations/${row.original.id}`}
        className='block w-full'
      >
        {formatDistanceToNow(new Date(row.getValue('createdAt')), {
          addSuffix: true
        })}
      </Link>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const organization = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(organization.id)}
            >
              Copy organization ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/${organization.userId}/organizations/${organization.id}/edit`}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${organization.userId}/organizations/${organization.id}/delete`}
              >
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { formatDistanceToNow } from 'date-fns'
// import { createColumn } from '@/components/data-table/columns'
// import { MoreHorizontal } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'

// export interface Organization {
//   id: string
//   name: string
//   createdAt: Date
//   userId: string
// }

// export const columns: ColumnDef<Organization>[] = [
//   createColumn<Organization>({
//     accessorKey: 'name',
//     header: 'Name',
//     getValue: (row, key) => row[key],
//     linkPrefix: row => `/${row.userId}/organizations`
//   }),
//   createColumn<Organization>({
//     accessorKey: 'createdAt',
//     header: 'Created',
//     getValue: (row, key) => row[key],
//     formatValue: value =>
//       formatDistanceToNow(new Date(value), { addSuffix: true })
//   }),
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       const organization = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' className='h-8 w-8 p-0'>
//               <span className='sr-only'>Open menu</span>
//               <MoreHorizontal className='h-4 w-4' />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy organization ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <a
//                 href={`/${organization.userId}/organizations/${organization.id}/edit`}
//               >
//                 Edit
//               </a>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <a
//                 href={`/${organization.userId}/organizations/${organization.id}/delete`}
//               >
//                 Delete
//               </a>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { formatDistanceToNow } from 'date-fns'
// import { createColumn } from '@/components/data-table/columns'
// import { MoreHorizontal } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'

// export type Organization = {
//   id: string
//   name: string
//   createdAt: Date
//   userId: string
// }

// export const columns: ColumnDef<Organization>[] = [
//   createColumn({
//     accessorKey: 'name',
//     header: 'Name',
//     getValue: (row, key) => row[key],
//     linkPrefix: row => `/${row.userId}/organizations`
//   }),
//   createColumn({
//     accessorKey: 'createdAt',
//     header: 'Created',
//     getValue: (row, key) => row[key],
//     formatValue: value =>
//       formatDistanceToNow(new Date(value), { addSuffix: true })
//   }),
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       const organization = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' className='h-8 w-8 p-0'>
//               <span className='sr-only'>Open menu</span>
//               <MoreHorizontal className='h-4 w-4' />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy organization ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <a
//                 href={`/${organization.userId}/organizations/${organization.id}/edit`}
//               >
//                 Edit
//               </a>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <a
//                 href={`/${organization.userId}/organizations/${organization.id}/delete`}
//               >
//                 Delete
//               </a>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

// 'use client'

// import Link from 'next/link'
// import { ColumnDef } from '@tanstack/react-table'
// import { formatDistanceToNow } from 'date-fns'
// import { MoreHorizontal } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'

// export type Organization = {
//   id: string
//   name: string
//   createdAt: Date
//   userId: string
// }

// export const columns: ColumnDef<Organization>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link
//         href={`/${row.original.userId}/organizations/${row.original.id}`}
//         className='hover:underline'
//       >
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) =>
//       formatDistanceToNow(new Date(row.getValue('createdAt')), {
//         addSuffix: true
//       })
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       const organization = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' className='h-8 w-8 p-0'>
//               <span className='sr-only'>Open menu</span>
//               <MoreHorizontal className='h-4 w-4' />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy organization ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <Link
//                 href={`/${organization.userId}/organizations/${organization.id}/edit`}
//               >
//                 Edit
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Link
//                 href={`/${organization.userId}/organizations/${organization.id}/delete`}
//               >
//                 Delete
//               </Link>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]
