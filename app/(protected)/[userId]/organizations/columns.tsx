'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

export type Organization = {
  id: string
  name: string
  createdAt: Date
  userId: string
}

export const columns: ColumnDef<Organization>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/${row.original.userId}/organizations/${row.original.id}`}
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
// import {
//   IconDotsVertical,
//   IconChevronUp,
//   IconChevronDown,
//   IconSelector
// } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { formatDistanceToNow } from 'date-fns'

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'name',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant='ghost'
//           className='-ml-4 h-8 data-[sorting=true]:font-bold'
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           <span>Name</span>
//           {{
//             asc: <IconChevronUp className='ml-2 h-4 w-4' />,
//             desc: <IconChevronDown className='ml-2 h-4 w-4' />
//           }[column.getIsSorted() as string] ?? (
//             <IconSelector className='ml-2 h-4 w-4' />
//           )}
//         </Button>
//       )
//     },
//     enableSorting: true,
//     enableColumnFilter: true
//   },
//   {
//     accessorKey: 'createdAt',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant='ghost'
//           className='-ml-4 h-8 data-[sorting=true]:font-bold'
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           <span>Created</span>
//           {{
//             asc: <IconChevronUp className='ml-2 h-4 w-4' />,
//             desc: <IconChevronDown className='ml-2 h-4 w-4' />
//           }[column.getIsSorted() as string] ?? (
//             <IconSelector className='ml-2 h-4 w-4' />
//           )}
//         </Button>
//       )
//     },
//     enableSorting: true,
//     cell: ({ row }) => {
//       const date = new Date(row.getValue('createdAt'))
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       const organization = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' size='icon' className='h-8 w-8'>
//               <IconDotsVertical className='h-4 w-4' />
//               <span className='sr-only'>Open menu</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Delete</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import {
//   IconDotsVertical,
//   IconChevronUp,
//   IconChevronDown,
//   IconSelector
// } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { formatDistanceToNow } from 'date-fns'

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'name',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant='ghost'
//           className='-ml-4 h-8 data-[sorting=true]:font-bold'
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           <span>Name</span>
//           {{
//             asc: <IconChevronUp className='ml-2 h-4 w-4' />,
//             desc: <IconChevronDown className='ml-2 h-4 w-4' />
//           }[column.getIsSorted() as string] ?? (
//             <IconSelector className='ml-2 h-4 w-4' />
//           )}
//         </Button>
//       )
//     }
//   },
//   {
//     accessorKey: 'createdAt',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant='ghost'
//           className='-ml-4 h-8 data-[sorting=true]:font-bold'
//           onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
//         >
//           <span>Created</span>
//           {{
//             asc: <IconChevronUp className='ml-2 h-4 w-4' />,
//             desc: <IconChevronDown className='ml-2 h-4 w-4' />
//           }[column.getIsSorted() as string] ?? (
//             <IconSelector className='ml-2 h-4 w-4' />
//           )}
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const date = new Date(row.getValue('createdAt'))
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => {
//       const organization = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant='ghost' size='icon' className='h-8 w-8'>
//               <IconDotsVertical className='h-4 w-4' />
//               <span className='sr-only'>Open menu</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Delete</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import {
//   IconDotsVertical,
//   IconChevronUp,
//   IconChevronDown,
//   IconArrowsSort
// } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { formatDistanceToNow } from 'date-fns'

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'name',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant='ghost'
//           className='-ml-4 h-8 data-[state=open]:bg-accent'
//         >
//           <span>Name</span>
//           {column.getIsSorted() === 'desc' ? (
//             <IconChevronDown className='ml-2 h-4 w-4' />
//           ) : column.getIsSorted() === 'asc' ? (
//             <IconChevronUp className='ml-2 h-4 w-4' />
//           ) : (
//             <IconArrowsSort className='ml-2 h-4 w-4' />
//           )}
//         </Button>
//       )
//     }
//   },
//   {
//     accessorKey: 'createdAt',
//     header: ({ column }) => {
//       return (
//         <Button
//           variant='ghost'
//           className='-ml-4 h-8 data-[state=open]:bg-accent'
//         >
//           <span>Created</span>
//           {column.getIsSorted() === 'desc' ? (
//             <IconChevronDown className='ml-2 h-4 w-4' />
//           ) : column.getIsSorted() === 'asc' ? (
//             <IconChevronUp className='ml-2 h-4 w-4' />
//           ) : (
//             <IconArrowsSort className='ml-2 h-4 w-4' />
//           )}
//         </Button>
//       )
//     },
//     cell: ({ row }) => {
//       const date = new Date(row.getValue('createdAt'))
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
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
//               <IconDotsVertical className='h-4 w-4' />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Delete</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import {
//   IconDotsVertical,
//   IconChevronUp,
//   IconChevronDown,
//   IconSelector
// } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { formatDistanceToNow } from 'date-fns'

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'name',
//     header: ({ column }) => {
//       return (
//         <div className='flex items-center space-x-2'>
//           <span>Name</span>
//           {{
//             asc: <IconChevronUp className='h-4 w-4' />,
//             desc: <IconChevronDown className='h-4 w-4' />
//           }[column.getIsSorted() as string] ?? (
//             <IconSelector className='h-4 w-4' />
//           )}
//         </div>
//       )
//     },
//     enableSorting: true
//   },
//   {
//     accessorKey: 'createdAt',
//     header: ({ column }) => {
//       return (
//         <div className='flex items-center space-x-2'>
//           <span>Created</span>
//           {{
//             asc: <IconChevronUp className='h-4 w-4' />,
//             desc: <IconChevronDown className='h-4 w-4' />
//           }[column.getIsSorted() as string] ?? (
//             <IconSelector className='h-4 w-4' />
//           )}
//         </div>
//       )
//     },
//     enableSorting: true,
//     cell: ({ row }) => {
//       const date = new Date(row.getValue('createdAt'))
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
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
//               <IconDotsVertical className='h-4 w-4' />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Delete</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { IconDotsVertical } from '@tabler/icons-react'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu'
// import { formatDistanceToNow } from 'date-fns'

// export const columns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'name',
//     header: 'Name'
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) => {
//       const date = new Date(row.getValue('createdAt'))
//       return formatDistanceToNow(date, { addSuffix: true })
//     }
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
//               <IconDotsVertical className='h-4 w-4' />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align='end'>
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(organization.id)}
//             >
//               Copy ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View details</DropdownMenuItem>
//             <DropdownMenuItem>Delete</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     }
//   }
// ]

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

// export interface Organization {
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
//         className='block w-full'
//       >
//         {row.getValue('name')}
//       </Link>
//     )
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created',
//     cell: ({ row }) => (
//       <Link
//         href={`/${row.original.userId}/organizations/${row.original.id}`}
//         className='block w-full'
//       >
//         {formatDistanceToNow(new Date(row.getValue('createdAt')), {
//           addSuffix: true
//         })}
//       </Link>
//     )
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
//             <DropdownMenuItem asChild>
//               <Link
//                 href={`/${organization.userId}/organizations/${organization.id}/edit`}
//               >
//                 Edit
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
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
