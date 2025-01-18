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
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { IconLoader, IconUser, IconCirclePlus } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { useMediaQuery } from '@/hooks/use-media-query'
// import { CreateCustomer, ReadCustomers } from './[customerId]/component'
// import { CreateInvoice, ReadInvoices } from './[invoiceId]/component'
import { CustomerForm } from '../../customer/[customerId]/form'
import { InvoiceForm } from '../../invoice/[invoiceId]/form'
import { deleteAction } from '../../user/[userId]/actions'

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
            <span className='sr-only'>Create</span>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <CustomerForm userId={userId} organizationId={organizationId} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='flex items-center gap-2'>
          <IconCirclePlus className='h-6 w-6' />
          <span className='sr-only'>Create</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
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
    <div className=''>
      <Table>
        <TableHeader>
          <TableRow
            // [&_tr:last-child]:border-0
            className={cn('hover:bg-transparent')}
          >
            <TableHead className='w-[200px] p-4'>Name</TableHead>
            <TableHead className='p-4'>Email</TableHead>
            <TableHead className='p-4'>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(customer => (
            <TableRow key={customer.id}>
              <TableCell className='p-0 font-medium'>
                <Link
                  href={`/${userId}/${organizationId}/${customer.id}`}
                  className='block p-4 font-semibold'
                >
                  <div className='flex items-center gap-2'>
                    <IconUser className='h-4 w-4' />
                    {customer.name}
                  </div>
                </Link>
              </TableCell>
              <TableCell className='p-0'>
                <Link
                  href={`/${userId}/${organizationId}/${customer.id}`}
                  className='block p-4'
                >
                  {customer.email}
                </Link>
              </TableCell>
              <TableCell className='p-0'>
                <Link
                  href={`/${userId}/${organizationId}/${customer.id}`}
                  className='block p-4'
                >
                  {formatDistanceToNow(new Date(customer.createdAt), {
                    addSuffix: true
                  })}
                </Link>
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
            <span className='sr-only'>Create</span>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <InvoiceForm
            userId={userId}
            organizationId={organizationId}
            customers={customers}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='flex items-center gap-2'>
          <IconCirclePlus className='h-6 w-6' />
          <span className='sr-only'>Create</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Invoice</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
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
    <div className=''>
      <Table>
        <TableHeader>
          <TableRow
            // [&_tr:last-child]:border-0
            className={cn('hover:bg-transparent')}
          >
            <TableHead className='w-[100px] p-4'>Date</TableHead>
            <TableHead className='p-4'>Customer</TableHead>
            <TableHead className='p-4'>Email</TableHead>
            <TableHead className='p-4'>Status</TableHead>
            <TableHead className='p-4 text-right'>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => {
            const customer = customers.find(c => c.id === invoice.customerId)
            return (
              <TableRow key={invoice.id}>
                <TableCell className='p-0 font-medium'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    {customer ? customer.name : 'Unknown'}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
                    className='block p-4'
                  >
                    {customer ? customer.email : 'N/A'}
                  </Link>
                </TableCell>
                <TableCell className='p-0'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
                    className='block p-4'
                  >
                    <Badge
                      className={cn(
                        'rounded-full capitalize',
                        invoice.status === 'open' &&
                          'bg-[#4285F4] text-background hover:bg-[#4285F4]',
                        invoice.status === 'paid' &&
                          'bg-[#0F9D58] text-background hover:bg-[#0F9D58]',
                        invoice.status === 'void' &&
                          'bg-[#F4B400] text-background hover:bg-[#F4B400]',
                        invoice.status === 'uncollectible' &&
                          'bg-[#DB4437] text-background hover:bg-[#DB4437]'
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-right'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
                    className='block p-4 font-semibold'
                  >
                    ${(invoice.value / 100).toFixed(2)}
                  </Link>
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
