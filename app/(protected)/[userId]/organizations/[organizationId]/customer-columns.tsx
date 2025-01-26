'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { IconDotsVertical } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return formatDistanceToNow(date, { addSuffix: true })
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <IconDotsVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
            <DropdownMenuItem>Delete customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

// 'use client'

// import Link from 'next/link'
// import type { ColumnDef } from '@tanstack/react-table'
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

// export type Customer = {
//   id: number
//   name: string
//   email: string
//   createdAt: Date
//   userId: string
// }

// export const columns: ColumnDef<Customer>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name',
//     cell: ({ row }) => (
//       <Link
//         href={`/${row.original.userId}/customers/${row.original.id}`}
//         className='hover:underline'
//       >
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'email',
//     header: 'Email'
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
//       const customer = row.original

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
//               onClick={() =>
//                 navigator.clipboard.writeText(customer.id.toString())
//               }
//             >
//               Copy customer ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <Link href={`/${customer.userId}/customers/${customer.id}/edit`}>
//                 Edit
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Link
//                 href={`/${customer.userId}/customers/${customer.id}/delete`}
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
