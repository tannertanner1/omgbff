import { redirect } from 'next/navigation'
import { getAllCustomers, getUserCustomers } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'
import type { Customer } from './columns'

export default async function Page() {
  const user = await verifySession()

  if (!hasPermission(user, 'customers', 'view')) {
    redirect('/')
  }

  let customersData
  if (user.role === 'admin' || user.role === 'owner') {
    customersData = await getAllCustomers()
  } else {
    customersData = await getUserCustomers({ userId: user.id })
  }

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
      invoiceCount: customer.invoiceCount,
      invoiceTotal: customer.invoiceTotal,
      invoices: customer.invoices || []
    })) || []

  return <Component customers={customers} userId={user.id} />
}
