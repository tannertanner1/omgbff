import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { hasPermission, type Customer } from '@/lib/abac'
import { Component } from './component'
import { getAllCustomers } from '@/db/queries'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'customers', 'view')) {
    redirect('/')
  }

  const data = await getAllCustomers()

  const customers: Customer[] = data.map(customer => ({
    ...customer,
    createdAt:
      customer.createdAt instanceof Date
        ? customer.createdAt.toISOString()
        : customer.createdAt,
    updatedAt:
      customer.updatedAt instanceof Date
        ? customer.updatedAt.toISOString()
        : customer.updatedAt,
    invoiceCount: customer.invoiceCount,
    invoiceTotal: customer.invoiceTotal,
    invoices: customer.invoices || [],
    address: customer.address || null,
    phone: customer.phone || null
  }))

  return <Component customers={customers} userId={user.id} />
}
