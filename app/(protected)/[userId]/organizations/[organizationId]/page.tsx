import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { IconCircleX } from '@tabler/icons-react'
import { Customers } from './customers/component'
import { Invoices } from './invoices/component'
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
} from '@/db/queries'
import { verifySession } from '@/lib/dal'
import { hasPermission } from '@/lib/abac'

export default async function Page({
  params
}: {
  params: Promise<{ userId: string; organizationId: string }>
}) {
  const user = await verifySession()

  const { userId, organizationId } = await params

  if (!hasPermission(user, 'organizations', 'view')) {
    redirect(`/${user.id}/organizations`)
  }

  const [organization, customers, invoices] = await Promise.all([
    getOrganizationById(organizationId),
    getOrganizationCustomers(organizationId),
    getOrganizationInvoices({ organizationId })
  ])

  if (organization == null) return notFound()

  return (
    <div className='flex h-fit'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>{organization.name}</h1>
          <Link href={`/${userId}/organizations`}>
            <IconCircleX className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>

        <div className='space-y-8'>
          <Customers
            customers={customers}
            userId={userId}
            organizationId={organizationId}
          />
          <Invoices
            invoices={invoices}
            userId={userId}
            organizationId={organizationId}
          />
        </div>
      </div>
    </div>
  )
}
