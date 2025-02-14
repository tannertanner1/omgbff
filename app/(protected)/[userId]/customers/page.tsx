import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { IconCirclePlus } from '@tabler/icons-react'
import { getAllCustomers } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'
import type { Customer } from './columns'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string }>
}) {
  const user = await verifySession()

  const { userId } = await params

  if (!hasPermission(user, 'customers', 'view')) {
    redirect(`/${user.id}/customers`)
  }

  if (user.role !== 'admin' && user.role !== 'owner') {
    notFound()
  }

  const customersData = await getAllCustomers()

  const customers: Customer[] =
    customersData?.map(customer => ({
      ...customer,
      createdAt:
        customer.createdAt instanceof Date
          ? customer.createdAt.toISOString()
          : customer.createdAt,
      updatedAt:
        customer.updatedAt instanceof Date
          ? customer.updatedAt.toISOString()
          : customer.updatedAt,
      invoiceCount: customer.invoices.length,
      invoiceTotal: customer.invoices.reduce(
        (sum, invoice) => sum + invoice.amount,
        0
      ),
      invoices: customer.invoices.map(invoice => ({
        id: invoice.id,
        amount: invoice.amount
      }))
    })) || []

  return (
    <div className='flex h-fit'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Customers</h1>
          <Link href={`/${userId}/customers/new`}>
            <IconCirclePlus className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>
        <Component customers={customers} userId={userId} />
      </div>
    </div>
  )
}
