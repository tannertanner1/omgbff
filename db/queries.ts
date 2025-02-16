import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  organizations,
  userOrganizations,
  customers,
  invoices,
  users
} from '@/db/schema'
import { hasPermission } from '@/lib/abac'
import { verifySession } from '@/lib/dal'
import { notFound } from 'next/navigation'

async function getUserOrganizations() {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'organizations', 'view')) {
    return []
  }

  return await db.query.userOrganizations.findMany({
    where: eq(userOrganizations.userId, user.id),
    with: {
      organization: true
    },
    orderBy: (userOrganizations, { desc }) => [
      desc(userOrganizations.createdAt)
    ]
  })
}

async function getOrganizationById(organizationId: string) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'organizations', 'view')) {
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
  const user = await verifySession()
  if (!user || !hasPermission(user, 'customers', 'view')) {
    return []
  }

  return await db.query.customers
    .findMany({
      where: eq(customers.organizationId, organizationId),
      with: {
        invoices: {
          columns: {
            id: true,
            amount: true
          }
        }
      }
    })
    .then(customers =>
      customers.map(customer => ({
        ...customer,
        invoiceCount: customer.invoices.length,
        invoiceTotal: customer.invoices.reduce(
          (sum: number, invoice: { amount: number }) => sum + invoice.amount,
          0
        )
      }))
    )
}

// async function getOrganizationInvoices({
//   organizationId
// }: {
//   organizationId: string
// }) {
async function getOrganizationInvoices(organizationId: string) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'invoices', 'view')) {
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
    where: eq(customers.id, customerId),
    with: {
      invoices: true
    }
  })

  return customer
}

async function getInvoiceById({ invoiceId }: { invoiceId: string }) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'invoices', 'view')) {
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

async function getAllCustomers() {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.customers
    .findMany({
      with: {
        invoices: true,
        organization: true
      }
    })
    .then(customers =>
      customers.map(customer => ({
        ...customer,
        invoiceCount: customer.invoices.length,
        invoiceTotal: customer.invoices.reduce(
          (sum: number, invoice: { amount: number }) => sum + invoice.amount,
          0
        )
      }))
    )
}

async function getAllInvoices() {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.invoices.findMany({
    with: {
      customer: {
        columns: {
          name: true,
          email: true,
          organizationId: true
        }
      }
    },
    orderBy: (invoices, { desc }) => [desc(invoices.createdAt)]
  })
}

async function getAllOrganizations() {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.organizations.findMany({
    orderBy: (organizations, { desc }) => [desc(organizations.createdAt)]
  })
}

async function getAllUsers() {
  const user = await verifySession()
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return []
  }

  return await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)]
  })
}

async function getUserById(userId: string) {
  const user = await verifySession()
  if (!user || !hasPermission(user, 'users', 'view')) {
    return null
  }

  return await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
}

export {
  getUserOrganizations,
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices,
  getCustomerById,
  getInvoiceById,
  getAllCustomers,
  getAllInvoices,
  getAllOrganizations,
  getAllUsers,
  getUserById
}
