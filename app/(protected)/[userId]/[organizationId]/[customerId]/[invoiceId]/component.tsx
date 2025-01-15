'use client'

import * as React from 'react'
import Link from 'next/link'
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
import { IconFileInvoice } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { useMediaQuery } from '@/hooks/use-media-query'
import { InvoiceForm } from './form'

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
          <Button>Create Invoice</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
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
        <Button>Create Invoice</Button>
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
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
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
                <TableCell className='font-medium'>
                  <Link
                    href={`/${userId}/${organizationId}/invoices/${invoice.id}`}
                    className='flex items-center gap-2 hover:underline'
                  >
                    <IconFileInvoice className='h-4 w-4' />
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

export { CreateInvoice, ReadInvoices }
