'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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
import { IconUser } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CustomerForm } from './form'

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
          <Button>Create Customer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm userId={userId} organizationId={organizationId} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create Customer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New Customer</DrawerTitle>
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
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
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

export { CreateCustomer, ReadCustomers }
