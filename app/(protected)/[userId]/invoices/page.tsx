import { notFound, redirect } from 'next/navigation'
import { getAllInvoices } from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'
import { Component } from './component'
import type { Invoice } from './columns'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string }>
}) {
  const user = await verifySession()
  const { userId } = await params

  if (!hasPermission(user, 'invoices', 'view')) {
    redirect(`/${user.id}/invoices`)
  }

  if (user.role !== 'admin' && user.role !== 'owner') {
    notFound()
  }

  const rawInvoices = await getAllInvoices()

  const invoices: Invoice[] = rawInvoices.map(invoice => ({
    ...invoice,
    createdAt:
      invoice.createdAt instanceof Date
        ? invoice.createdAt.toISOString()
        : invoice.createdAt,
    updatedAt:
      invoice.updatedAt instanceof Date
        ? invoice.updatedAt.toISOString()
        : invoice.updatedAt,
    customer: {
      email: invoice.customer.email,
      name: invoice.customer.name
    }
  }))

  return <Component invoices={invoices} userId={userId} />
}
