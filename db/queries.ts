import { eq, inArray, desc, asc, sql, ilike } from 'drizzle-orm'
import { db } from '@/db'
import { organizations, userOrganizations } from '@/db/schema'
import { customers, invoices } from '@/db/schema'
import { hasPermission } from '@/lib/abac'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Status } from '@/data/invoice-statuses'

// async function getUserOrganizations(
//   options: {
//     page?: number
//     perPage?: number
//     sort?: {
//       column: string
//       order: 'asc' | 'desc'
//     }
//     search?: string
//     status?: string
//     priority?: string
//   } = {}
// ) {
//   const { page = 1, perPage = 10, sort, search, status, priority } = options

//   const offset = (page - 1) * perPage

//   let query = db.select().from(organizations)

//   if (search) {
//     query = query.where(ilike(organizations.name, `%${search}%`))
//   }

//   if (status) {
//     query = query.where(eq(organizations.status, status))
//   }

//   if (priority) {
//     query = query.where(eq(organizations.priority, priority))
//   }

//   if (sort) {
//     const orderFunc = sort.order === 'desc' ? desc : asc
//     query = query.orderBy(
//       orderFunc(organizations[sort.column as keyof typeof organizations])
//     )
//   }

//   const [{ count }] = await db
//     .select({ count: sql<number>`count(*)` })
//     .from(organizations)
//     .execute()

//   const data = await query.limit(perPage).offset(offset).execute()

//   return {
//     data,
//     pageCount: Math.ceil(count / perPage)
//   }
// }

// export async function getUserOrganizations(
//   options: {
//     page?: number
//     perPage?: number
//     sort?: {
//       column: string
//       order: 'asc' | 'desc'
//     }
//     search?: string
//     status?: string
//     priority?: string
//   } = {}
// ) {
//   const { page = 1, perPage = 10, sort, search, status, priority } = options

//   const offset = (page - 1) * perPage

//   let query = db.select().from(organizations)

//   if (search) {
//     query = query.where(ilike(organizations.name, `%${search}%`))
//   }

//   if (status) {
//     query = query.where(eq(organizations.status, status))
//   }

//   if (priority) {
//     query = query.where(eq(organizations.priority, priority))
//   }

//   if (sort) {
//     const orderFunc = sort.order === 'desc' ? desc : asc
//     query = query.orderBy(
//       orderFunc(organizations[sort.column as keyof typeof organizations])
//     )
//   }

//   const [{ count }] = await db
//     .select({ count: sql<number>`count(*)` })
//     .from(organizations)
//     .execute()

//   const data = await query.limit(perPage).offset(offset).execute()

//   return {
//     data,
//     pageCount: Math.ceil(count / perPage)
//   }
// }

async function getUserOrganizations() {
  const session = await auth()
  if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
    return []
  }

  return await db.query.userOrganizations.findMany({
    where: eq(userOrganizations.userId, session.user.id),
    with: {
      organization: true
    }
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

// async function getOrganizationCustomers(options: {
//   organizationId: string
//   page?: number
//   perPage?: number
//   sort?: {
//     column: string
//     order: 'asc' | 'desc'
//   }
//   search?: string
// }) {
//   const { organizationId, page = 1, perPage = 10, sort, search } = options

//   const offset = (page - 1) * perPage

//   let query = db
//     .select()
//     .from(customers)
//     .where(eq(customers.organizationId, organizationId))

//   if (search) {
//     query = query.where(
//       or(
//         ilike(customers.name, `%${search}%`),
//         ilike(customers.email, `%${search}%`)
//       )
//     )
//   }

//   if (sort) {
//     const orderFunc = sort.order === 'desc' ? desc : asc
//     query = query.orderBy(
//       orderFunc(customers[sort.column as keyof typeof customers])
//     )
//   }

//   const [{ count }] = await db
//     .select({ count: sql<number>`count(*)` })
//     .from(customers)
//     .where(eq(customers.organizationId, organizationId))
//     .execute()

//   const data = await query.limit(perPage).offset(offset).execute()

//   return {
//     data,
//     pageCount: Math.ceil(count / perPage)
//   }
// }

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

async function getOrganizationInvoices(organizationId: string) {
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

export {
  getUserOrganizations,
  getOrganizationById,
  getOrganizationCustomers,
  getOrganizationInvoices
}
