import { notFound, redirect } from 'next/navigation'
import { getAllCustomers } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'
import type { Customer } from './columns'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'customers', 'view')) {
    redirect('/customers')
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

  return <Component customers={customers} userId={user.id} />
}
