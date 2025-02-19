'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Header } from '@/components/data-table/header'
import { Actions } from '@/components/data-table/actions'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  ADDRESS,
  PHONE,
  type Country,
  type Region
} from '@/data/customer-fields'

export type Customer = {
  id: string
  organizationId: string
  userId: string
  email: string
  name: string
  invoiceCount: number
  invoiceTotal: number
  invoices: Array<{ id: string; amount: number }>
  address: Array<{
    label: (typeof ADDRESS)[number]
    line1: string
    line2?: string
    city: string
    region: Region
    postal: string
    country: Country
  }> | null
  phone: Array<{
    label: (typeof PHONE)[number]
    number: string
  }> | null
  createdAt: string | Date
  updatedAt: string | Date
}

export function getCustomerColumns(
  userId: string,
  organizationId: string,
  onEdit: (row: Customer) => void,
  onDelete: (row: Customer) => Promise<void>
): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => <Header column={column} label='ID' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('id')}</div>
      )
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <Header column={column} label='Email' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('email')}</div>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <Header column={column} label='Name' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>{row.getValue('name')}</div>
      )
    },
    {
      accessorKey: 'invoiceCount',
      header: ({ column }) => <Header column={column} label='Invoices' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>
          {row.getValue('invoiceCount')}
        </div>
      )
    },
    {
      accessorKey: 'invoiceTotal',
      header: ({ column }) => <Header column={column} label='Total' />,
      cell: ({ row }) => (
        <div className='whitespace-nowrap px-4'>
          $
          {(row.getValue('invoiceTotal') as number).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      )
    },
    {
      accessorKey: 'address',
      header: ({ column }) => <Header column={column} label='Address' />,
      cell: ({ row }) => {
        const customer = row.original
        const mailingAddress = customer.address?.find(
          addr => addr.label === ADDRESS[0]
        )
        return (
          <div className='px-4'>
            <Badge className='bg-primary text-primary-foreground'>
              {mailingAddress
                ? `${mailingAddress.line1}${mailingAddress.line2 ? `, ${mailingAddress.line2}` : ''}, ${mailingAddress.city}, ${mailingAddress.region} ${mailingAddress.postal}, ${mailingAddress.country}`
                : 'N/A'}
            </Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => <Header column={column} label='Phone' />,
      cell: ({ row }) => {
        const customer = row.original
        const primaryPhone = customer.phone?.find(
          phone => phone.label === PHONE[0]
        )
        return (
          <div className='px-4'>
            <Badge className='bg-primary text-primary-foreground'>
              {primaryPhone ? primaryPhone.number : 'N/A'}
            </Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <Header column={column} label='Created' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('createdAt')
        return (
          <div className='whitespace-nowrap px-4'>
            {dateValue instanceof Date
              ? format(dateValue, 'MMM d, yyyy')
              : typeof dateValue === 'string'
                ? format(new Date(dateValue), 'MMM d, yyyy')
                : 'Invalid Date'}
          </div>
        )
      }
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <Header column={column} label='Updated' />,
      cell: ({ row }) => {
        const dateValue = row.getValue('updatedAt')
        return (
          <div className='whitespace-nowrap px-4'>
            {dateValue instanceof Date
              ? format(dateValue, 'MMM d, yyyy')
              : typeof dateValue === 'string'
                ? format(new Date(dateValue), 'MMM d, yyyy')
                : 'Invalid Date'}
          </div>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />
      )
    }
  ]
}

// 'use client'

// import type { ColumnDef } from '@tanstack/react-table'
// import { Header } from '@/components/data-table/header'
// import { Actions } from '@/components/data-table/actions'
// import { format } from 'date-fns'
// import { Badge } from '@/components/ui/badge'
// import {
//   ADDRESS,
//   PHONE,
//   type Country,
//   type Region
// } from '@/data/customer-fields'

// export type Customer = {
//   id: string
//   organizationId: string
//   userId: string
//   email: string
//   name: string
//   invoiceCount: number
//   invoiceTotal: number
//   invoices: Array<{ id: string; amount: number }>
//   address: Array<{
//     label: (typeof ADDRESS)[number]
//     line1: string
//     line2?: string
//     city: string
//     region: Region
//     postal: string
//     country: Country
//   }>
//   phone: Array<{
//     label: (typeof PHONE)[number]
//     number: string
//   }>
//   createdAt: string | Date
//   updatedAt: string | Date
// }

// export function getCustomerColumns(
//   userId: string,
//   organizationId: string,
//   onEdit: (row: Customer) => void,
//   onDelete: (row: Customer) => Promise<void>
// ): ColumnDef<Customer>[] {
//   return [
//     {
//       accessorKey: 'id',
//       header: ({ column }) => <Header column={column} label='ID' />,
//       cell: ({ row }) => (
//         <div className='whitespace-nowrap px-4'>{row.getValue('id')}</div>
//       )
//     },
//     {
//       accessorKey: 'email',
//       header: ({ column }) => <Header column={column} label='Email' />,
//       cell: ({ row }) => (
//         <div className='whitespace-nowrap px-4'>{row.getValue('email')}</div>
//       )
//     },
//     {
//       accessorKey: 'name',
//       header: ({ column }) => <Header column={column} label='Name' />,
//       cell: ({ row }) => (
//         <div className='whitespace-nowrap px-4'>{row.getValue('name')}</div>
//       )
//     },
//     {
//       accessorKey: 'invoiceCount',
//       header: ({ column }) => <Header column={column} label='Invoices' />,
//       cell: ({ row }) => (
//         <div className='whitespace-nowrap px-4'>
//           {row.getValue('invoiceCount')}
//         </div>
//       )
//     },
//     {
//       accessorKey: 'invoiceTotal',
//       header: ({ column }) => <Header column={column} label='Total' />,
//       cell: ({ row }) => (
//         <div className='whitespace-nowrap px-4'>
//           $
//           {(row.getValue('invoiceTotal') as number).toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//           })}
//         </div>
//       )
//     },
//     {
//       accessorKey: 'address',
//       header: ({ column }) => <Header column={column} label='Address' />,
//       cell: ({ row }) => {
//         const customer = row.original
//         const mailingAddress = customer.address.find(
//           addr => addr.label === ADDRESS[0]
//         )
//         return (
//           <div className='px-4'>
//             <Badge className='bg-primary text-primary-foreground'>
//               {mailingAddress
//                 ? `${mailingAddress.line1}${mailingAddress.line2 ? `, ${mailingAddress.line2}` : ''}, ${mailingAddress.city}, ${mailingAddress.region} ${mailingAddress.postal}, ${mailingAddress.country}`
//                 : 'N/A'}
//             </Badge>
//           </div>
//         )
//       }
//     },
//     {
//       accessorKey: 'phone',
//       header: ({ column }) => <Header column={column} label='Phone' />,
//       cell: ({ row }) => {
//         const customer = row.original
//         const primaryPhone = customer.phone.find(
//           phone => phone.label === PHONE[0]
//         )
//         return (
//           <div className='px-4'>
//             <Badge className='bg-primary text-primary-foreground'>
//               {primaryPhone ? primaryPhone.number : 'N/A'}
//             </Badge>
//           </div>
//         )
//       }
//     },
//     {
//       accessorKey: 'createdAt',
//       header: ({ column }) => <Header column={column} label='Created' />,
//       cell: ({ row }) => {
//         const dateValue = row.getValue('createdAt')
//         return (
//           <div className='whitespace-nowrap px-4'>
//             {dateValue instanceof Date
//               ? format(dateValue, 'MMM d, yyyy')
//               : typeof dateValue === 'string'
//                 ? format(new Date(dateValue), 'MMM d, yyyy')
//                 : 'Invalid Date'}
//           </div>
//         )
//       }
//     },
//     {
//       accessorKey: 'updatedAt',
//       header: ({ column }) => <Header column={column} label='Updated' />,
//       cell: ({ row }) => {
//         const dateValue = row.getValue('updatedAt')
//         return (
//           <div className='whitespace-nowrap px-4'>
//             {dateValue instanceof Date
//               ? format(dateValue, 'MMM d, yyyy')
//               : typeof dateValue === 'string'
//                 ? format(new Date(dateValue), 'MMM d, yyyy')
//                 : 'Invalid Date'}
//           </div>
//         )
//       }
//     },
//     {
//       id: 'actions',
//       cell: ({ row }) => (
//         <Actions row={row.original} onEdit={onEdit} onDelete={onDelete} />
//       )
//     }
//   ]
// }
