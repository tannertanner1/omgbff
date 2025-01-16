'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  IconLoader,
  IconUser,
  IconFile,
  IconCirclePlus
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useMediaQuery } from '@/hooks/use-media-query'
// import { CreateCustomer, ReadCustomers } from './[customerId]/component'
// import { CreateInvoice, ReadInvoices } from './[invoiceId]/component'
import { CustomerForm } from './[customerId]/form'
import { InvoiceForm } from './[customerId]/[invoiceId]/form'
import { deleteAction } from '../actions'

interface OrganizationProps {
  organization: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
  customers: Array<{
    id: number
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
  }>
  invoices: Array<{
    id: number
    customerId: number
    value: number
    description: string
    status: string
    createdAt: Date
    updatedAt: Date
  }>
  userId: string
  organizationId: string
}

export function Organization({
  organization,
  customers,
  invoices,
  userId,
  organizationId
}: OrganizationProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      const formData = new FormData()
      formData.append('id', organization.id)
      const result = await deleteAction(formData)
      if (result.success) {
        router.push(`/${userId}`)
      } else {
        setIsDeleting(false)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-5xl p-4'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>{organization.name}</h1>
        <div className='text-sm text-gray-500'>
          Created{' '}
          {formatDistanceToNow(new Date(organization.createdAt), {
            addSuffix: true
          })}
        </div>
      </div>

      <div className='space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Customers</h2>
            <CreateCustomer userId={userId} organizationId={organizationId} />
          </div>
          <ReadCustomers
            customers={customers}
            userId={userId}
            organizationId={organizationId}
          />
        </div>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-semibold'>Invoices</h2>
            <CreateInvoice
              userId={userId}
              organizationId={organizationId}
              customers={customers}
            />
          </div>
          <ReadInvoices
            invoices={invoices}
            customers={customers}
            userId={userId}
            organizationId={organizationId}
          />
        </div>
      </div>

      <form onSubmit={handleDelete} className='mt-8'>
        <Button
          type='submit'
          variant='destructive'
          className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
          disabled={isDeleting}
        >
          {isDeleting ? (
            <IconLoader className='h-4 w-4 animate-spin' />
          ) : (
            'Delete'
          )}
        </Button>
      </form>
    </div>
  )
}

function CreateCustomer({
  userId,
  organizationId
}: {
  userId: string
  organizationId: string
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className='flex items-center gap-2'>
            <IconCirclePlus className='h-6 w-6' />
            <span className='sr-only'>Add</span>
          </button>
        </DialogTrigger>
        <DialogContent className='w-full'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className={cn('-mx-2 -mb-2 mt-1')}>
            <CustomerForm userId={userId} organizationId={organizationId} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='flex items-center gap-2'>
          <IconCirclePlus className='h-6 w-6' />
          <span className='sr-only'>Add</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className={cn('-pt-1 p-4')}>
          <CustomerForm userId={userId} organizationId={organizationId} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ReadCustomers({
  customers,
  userId,
  organizationId
}: {
  customers: OrganizationProps['customers']
  userId: string
  organizationId: string
}) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow className={cn('border-b hover:bg-transparent')}>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(customer => (
            <TableRow key={customer.id}>
              <TableCell className='font-medium'>
                <Link
                  href={`/${userId}/${organizationId}/customers/${customer.id}`}
                  className='flex items-center gap-2 hover:underline'
                >
                  <IconUser className='h-4 w-4' />
                  {customer.name}
                </Link>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(customer.createdAt), {
                  addSuffix: true
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CreateInvoice({
  userId,
  organizationId,
  customers
}: {
  userId: string
  organizationId: string
  customers: OrganizationProps['customers']
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className='flex items-center gap-2'>
            <IconCirclePlus className='h-6 w-6' />
            <span className='sr-only'>Add</span>
          </button>
        </DialogTrigger>
        <DialogContent className='w-full'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className={cn('-mx-2 -mb-2 mt-1')}>
            <InvoiceForm
              userId={userId}
              organizationId={organizationId}
              customers={customers}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='flex items-center gap-2'>
          <IconCirclePlus className='h-6 w-6' />
          <span className='sr-only'>Add</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className={cn('-pt-1 p-4')}>
          <InvoiceForm
            userId={userId}
            organizationId={organizationId}
            customers={customers}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ReadInvoices({
  invoices,
  customers,
  userId,
  organizationId
}: {
  invoices: OrganizationProps['invoices']
  customers: OrganizationProps['customers']
  userId: string
  organizationId: string
}) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow className={cn('border-b hover:bg-transparent')}>
            <TableHead>Id</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => {
            const customer = customers.find(c => c.id === invoice.customerId)
            return (
              <TableRow key={invoice.id}>
                <TableCell className='truncate font-medium'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
                    className='flex items-center gap-2 hover:underline'
                  >
                    <IconFile className='h-4 w-4' />
                    {invoice.id}
                  </Link>
                </TableCell>
                <TableCell>{customer ? customer.name : 'Unknown'}</TableCell>
                <TableCell>${(invoice.value / 100).toFixed(2)}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(invoice.createdAt), {
                    addSuffix: true
                  })}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { CreateCustomer, ReadCustomers, CreateInvoice, ReadInvoices }

// 'use client'

// import * as React from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog'
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger
// } from '@/components/ui/drawer'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { IconLoader, IconUser } from '@tabler/icons-react'
// import { IconFileInvoice } from '@tabler/icons-react'
// import { formatDistanceToNow } from 'date-fns'
// import { useMediaQuery } from '@/hooks/use-media-query'
// // import { CreateCustomer, ReadCustomers } from './[customerId]/component'
// // import { CreateInvoice, ReadInvoices } from './[invoiceId]/component'
// import { CustomerForm } from './[customerId]/form'
// import { InvoiceForm } from './[customerId]/[invoiceId]/form'
// import { deleteAction } from '../actions'

// interface OrganizationProps {
//   organization: {
//     id: string
//     name: string
//     createdAt: Date
//     updatedAt: Date
//   }
//   customers: Array<{
//     id: number
//     name: string
//     email: string
//     createdAt: Date
//     updatedAt: Date
//   }>
//   invoices: Array<{
//     id: number
//     customerId: number
//     value: number
//     description: string
//     status: string
//     createdAt: Date
//     updatedAt: Date
//   }>
//   userId: string
//   organizationId: string
// }

// export function Organization({
//   organization,
//   customers,
//   invoices,
//   userId,
//   organizationId
// }: OrganizationProps) {
//   const router = useRouter()
//   const [isDeleting, setIsDeleting] = React.useState(false)

//   const handleDelete = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsDeleting(true)
//     try {
//       const formData = new FormData()
//       formData.append('id', organization.id)
//       const result = await deleteAction(formData)
//       if (result.success) {
//         router.push(`/${userId}`)
//       } else {
//         setIsDeleting(false)
//       }
//     } catch (error) {
//       console.error('Delete failed:', error)
//       setIsDeleting(false)
//     }
//   }

//   return (
//     <div className='mx-auto w-full max-w-7xl p-6'>
//       <div className='mb-8 flex items-center justify-between'>
//         <h1 className='text-3xl font-bold'>{organization.name}</h1>
//         <div className='text-sm text-gray-500'>
//           Created{' '}
//           {formatDistanceToNow(new Date(organization.createdAt), {
//             addSuffix: true
//           })}
//         </div>
//       </div>

//       <div className='space-y-6'>
//         <div className='space-y-4'>
//           <div className='flex items-center justify-between'>
//             <h2 className='text-2xl font-semibold'>Customers</h2>
//             <CreateCustomer userId={userId} organizationId={organizationId} />
//           </div>
//           <ReadCustomers
//             customers={customers}
//             userId={userId}
//             organizationId={organizationId}
//           />
//         </div>

//         <div className='space-y-4'>
//           <div className='flex items-center justify-between'>
//             <h2 className='text-2xl font-semibold'>Invoices</h2>
//             <CreateInvoice
//               userId={userId}
//               organizationId={organizationId}
//               customers={customers}
//             />
//           </div>
//           <ReadInvoices
//             invoices={invoices}
//             customers={customers}
//             userId={userId}
//             organizationId={organizationId}
//           />
//         </div>
//       </div>

//       <form onSubmit={handleDelete} className='mt-8'>
//         <Button
//           type='submit'
//           variant='destructive'
//           className='w-full border border-[#DB4437] bg-background text-[#DB4437] hover:bg-[#DB4437] hover:text-background'
//           disabled={isDeleting}
//         >
//           {isDeleting ? (
//             <IconLoader className='h-4 w-4 animate-spin' />
//           ) : (
//             'Delete Organization'
//           )}
//         </Button>
//       </form>
//     </div>
//   )
// }

// function CreateCustomer({
//   userId,
//   organizationId
// }: {
//   userId: string
//   organizationId: string
// }) {
//   const [open, setOpen] = React.useState(false)
//   const isDesktop = useMediaQuery('(min-width: 768px)')

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button>Create</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle></DialogTitle>
//           </DialogHeader>
//           <CustomerForm userId={userId} organizationId={organizationId} />
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button>Create</Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle></DrawerTitle>
//         </DrawerHeader>
//         <div className='p-4'>
//           <CustomerForm userId={userId} organizationId={organizationId} />
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// function ReadCustomers({
//   customers,
//   userId,
//   organizationId
// }: {
//   customers: OrganizationProps['customers']
//   userId: string
//   organizationId: string
// }) {
//   return (
//     <div className='rounded-lg border'>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Name</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Created</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {customers.map(customer => (
//             <TableRow key={customer.id}>
//               <TableCell className='font-medium'>
//                 <Link
//                   href={`/${userId}/${organizationId}/customers/${customer.id}`}
//                   className='flex items-center gap-2 hover:underline'
//                 >
//                   <IconUser className='h-4 w-4' />
//                   {customer.name}
//                 </Link>
//               </TableCell>
//               <TableCell>{customer.email}</TableCell>
//               <TableCell>
//                 {formatDistanceToNow(new Date(customer.createdAt), {
//                   addSuffix: true
//                 })}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

// function CreateInvoice({
//   userId,
//   organizationId,
//   customers
// }: {
//   userId: string
//   organizationId: string
//   customers: OrganizationProps['customers']
// }) {
//   const [open, setOpen] = React.useState(false)
//   const isDesktop = useMediaQuery('(min-width: 768px)')

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button>Create Invoice</Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>New Invoice</DialogTitle>
//           </DialogHeader>
//           <InvoiceForm
//             userId={userId}
//             organizationId={organizationId}
//             customers={customers}
//           />
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button>Create Invoice</Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>New Invoice</DrawerTitle>
//         </DrawerHeader>
//         <div className='p-4'>
//           <InvoiceForm
//             userId={userId}
//             organizationId={organizationId}
//             customers={customers}
//           />
//         </div>
//       </DrawerContent>
//     </Drawer>
//   )
// }

// function ReadInvoices({
//   invoices,
//   customers,
//   userId,
//   organizationId
// }: {
//   invoices: OrganizationProps['invoices']
//   customers: OrganizationProps['customers']
//   userId: string
//   organizationId: string
// }) {
//   return (
//     <div className='rounded-lg border'>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Invoice ID</TableHead>
//             <TableHead>Customer</TableHead>
//             <TableHead>Amount</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Created</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {invoices.map(invoice => {
//             const customer = customers.find(c => c.id === invoice.customerId)
//             return (
//               <TableRow key={invoice.id}>
//                 <TableCell className='font-medium'>
//                   <Link
//                     href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
//                     className='flex items-center gap-2 hover:underline'
//                   >
//                     <IconFileInvoice className='h-4 w-4' />
//                     {invoice.id}
//                   </Link>
//                 </TableCell>
//                 <TableCell>{customer ? customer.name : 'Unknown'}</TableCell>
//                 <TableCell>${(invoice.value / 100).toFixed(2)}</TableCell>
//                 <TableCell>{invoice.status}</TableCell>
//                 <TableCell>
//                   {formatDistanceToNow(new Date(invoice.createdAt), {
//                     addSuffix: true
//                   })}
//                 </TableCell>
//               </TableRow>
//             )
//           })}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }

// export { CreateInvoice, ReadInvoices }
