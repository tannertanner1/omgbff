import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { hasPermission } from '@/lib/abac'
import {
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
} from '@/db/queries'
import { Customers } from './customers/component'
import { Invoices } from './invoices/component'
import Link from 'next/link'
import { IconCircleX } from '@tabler/icons-react'

export default async function Page({
  params
}: {
  params: { userId: string; organizationId: string }
}) {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }

  if (!hasPermission(session.user, 'organizations', 'view')) {
    redirect(`/${session.user.id}/organizations`)
  }

  const organization = await getOrganizationById(params.organizationId)
  if (!organization) {
    notFound()
  }

  const [customers, invoices] = await Promise.all([
    getOrganizationCustomers(params.organizationId),
    getOrganizationInvoices(params.organizationId)
  ])

  return (
    <div className='h-fit'>
      <div className='mx-auto w-full max-w-5xl p-4'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>{organization.name}</h1>
          <Link href={`/${params.userId}/organizations`}>
            <IconCircleX className='h-6 w-6 text-muted-foreground transition-colors hover:text-primary' />
          </Link>
        </div>

        <div className='space-y-8'>
          <Customers
            customers={customers}
            userId={params.userId}
            organizationId={params.organizationId}
          />
          <Invoices
            invoices={invoices}
            userId={params.userId}
            organizationId={params.organizationId}
          />
        </div>
      </div>
    </div>
  )
}
