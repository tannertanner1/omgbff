'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'

export type Organization = {
  userId: string
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export function getColumns(
  userId: string,
  onEdit: (row: Organization) => void,
  onDelete: (row: Organization) => Promise<void>
): ColumnDef<Organization>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => <div className='px-4'>{row.getValue('name')}</div>
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) => (
        <div className='px-4'>
          {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
        </div>
      )
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <Header column={column} label='Updated' />,
      cell: ({ row }) => (
        <div className='px-4'>
          {format(new Date(row.getValue('updatedAt')), 'MMM d, yyyy')}
        </div>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions
          row={row}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      )
    }
  ]
}

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { Header } from '@/components/data-table/header'
// import { Actions } from '@/components/data-table/actions'
// import { format } from 'date-fns'

// export type Organization = {
//   userId: string
//   id: string
//   name: string
//   createdAt: Date
//   updatedAt: Date
// }

// export function getColumns(userId: string): ColumnDef<Organization>[] {
//   return [
//     {
//       accessorKey: 'name',
//       header: ({ column }) => <Header column={column} label='Name' />,
//       cell: ({ row }) => <div className='px-4'>{row.getValue('name')}</div>
//     },
//     {
//       accessorKey: 'createdAt',
//       header: ({ column }) => <Header column={column} label='Created' />,
//       cell: ({ row }) => (
//         <div className='px-4'>
//           {format(new Date(row.getValue('createdAt')), 'MMM d, yyyy')}
//         </div>
//       )
//     },
//     {
//       accessorKey: 'updatedAt',
//       header: ({ column }) => <Header column={column} label='Updated' />,
//       cell: ({ row }) => (
//         <div className='px-4'>
//           {format(new Date(row.getValue('updatedAt')), 'MMM d, yyyy')}
//         </div>
//       )
//     },
//     {
//       id: 'actions',
//       cell: ({ row }) => (
//         <Actions
//           row={row}
//           onEdit={row => {
//             window.location.href = `/${userId}/organizations/${row.id}/edit`
//           }}
//           onDelete={row => {
//             const formData = new FormData()
//             formData.append('id', row.id)
//             fetch(`/api/organizations/${row.id}`, {
//               method: 'DELETE',
//               body: formData
//             }).then(() => {
//               window.location.reload()
//             })
//           }}
//         />
//       )
//     }
//   ]
// }

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { Columns } from '@/components/data-table/columns'
// import { deleteAction } from './actions'

// export type Organization = {
//   userId: string
//   id: string
//   name: string
//   createdAt: Date
//   updatedAt: Date
// }

// export function getColumns(
//   userId: string,
//   router: any
// ): ColumnDef<Organization>[] {
//   return Columns<Organization>(
//     [
//       {
//         userId: '',
//         id: '',
//         name: '',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     ], // Dummy data to generate initial columns
//     {
//       onEdit: row => {
//         router.push(`/${userId}/organizations/${row.id}/edit`)
//       },
//       onDelete: async row => {
//         try {
//           const formData = new FormData()
//           formData.append('id', row.id)
//           const result = await deleteAction(null, formData)
//           if (result.success) {
//             router.refresh()
//           }
//         } catch (error) {
//           console.error('Failed to delete organization:', error)
//         }
//       }
//     }
//   )
// }
