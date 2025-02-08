import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  organizations,
  userOrganizations,
  customers,
  invoices
} from '@/db/schema'
import { hasPermission } from '@/lib/abac'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'

async function getUserOrganizations() {
  const session = await auth()
  if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
    return []
  }

  return await db.query.userOrganizations.findMany({
    where: eq(userOrganizations.userId, session.user.id),
    with: {
      organization: true
    },
    orderBy: (userOrgs, { desc }) => [desc(userOrgs.createdAt)]
  })
}

async function getOrganizationById(organizationId: string) {
  const session = await auth()
  if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
    return null
  }

  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, organizationId),
    with: {
      userOrganizations: {
        with: {
          user: true
        }
      }
    }
  })

  if (!organization) {
    notFound()
  }

  return organization
}

async function getOrganizationCustomers(organizationId: string) {
  const session = await auth()
  if (!session?.user || !hasPermission(session.user, 'customers', 'view')) {
    return []
  }

  return await db.query.customers.findMany({
    where: eq(customers.organizationId, organizationId),
    with: {
      invoices: true
    }
  })
}

async function getOrganizationInvoices({
  organizationId
}: {
  organizationId: string
}) {
  const session = await auth()
  if (!session?.user || !hasPermission(session.user, 'invoices', 'view')) {
    return []
  }

  const organizationCustomers = await getOrganizationCustomers(organizationId)
  const customerIds = organizationCustomers.map(customer => customer.id)

  return await db.query.invoices.findMany({
    where: inArray(invoices.customerId, customerIds),
    with: {
      customer: true
    }
  })
}

async function getCustomerById({
  customerId
}: {
  customerId: string
  userId?: string
  organizationId?: string
}) {
  if (!customerId) return null

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId)
  })

  return customer
}

async function getInvoiceById({ invoiceId }: { invoiceId: string }) {
  const session = await auth()
  if (!session?.user || !hasPermission(session.user, 'invoices', 'view')) {
    return null
  }

  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, invoiceId),
    with: {
      customer: true
    }
  })

  if (!invoice) {
    notFound()
  }

  return invoice
}

export {
  getUserOrganizations,
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices,
  getCustomerById,
  getInvoiceById
}
