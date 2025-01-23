import { eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { organizations, userOrganizations } from '@/db/schema'
import { customers, invoices } from '@/db/schema'
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

// async function getOrganizationInvoices(organizationId: string) {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'invoices', 'view')) {
//     return []
//   }

//   const organizationCustomers = await getOrganizationCustomers(organizationId)
//   const customerIds = organizationCustomers.map(customer => customer.id)

//   return await db.query.invoices.findMany({
//     where: (invoice) => invoice.customerId.in(customerIds),
//     with: {
//       customer: true
//     }
//   })
// }

// import { eq } from 'drizzle-orm'
// import { db } from '@/db'
// import { organizations, users, userOrganizations } from '@/db/schema/users'
// import { customers, invoices } from '@/db/schema/invoices'
// import { hasPermission } from '@/lib/abac'
// import { auth } from '@/lib/auth'
// import { notFound } from 'next/navigation'

// async function getUserOrganizations() {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
//     return []
//   }

//   return await db.query.userOrganizations.findMany({
//     where: eq(userOrganizations.userId, session.user.id),
//     with: {
//       organization: true
//     }
//   })
// }

// async function getOrganizationById(organizationId: string) {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
//     return null
//   }

//   const organization = await db.query.organizations.findFirst({
//     where: eq(organizations.id, organizationId),
//     with: {
//       customers: true,
//       userOrganizations: {
//         with: {
//           user: true
//         }
//       }
//     }
//   })

//   if (!organization) {
//     notFound()
//   }

//   return organization
// }

// async function getOrganizationCustomers(organizationId: string) {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'customers', 'view')) {
//     return []
//   }

//   return await db.query.customers.findMany({
//     where: eq(customers.organizationId, organizationId),
//     with: {
//       invoices: true
//     }
//   })
// }

// async function getOrganizationInvoices(organizationId: string) {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'invoices', 'view')) {
//     return []
//   }

//   return await db.query.invoices.findMany({
//     where: eq(invoices.organizationId, organizationId),
//     with: {
//       customer: true
//     }
//   })
// }

// export {
//   getUserOrganizations,
//   getOrganizationById,
//   getOrganizationCustomers,
//   getOrganizationInvoices
// }

// import { db } from "@/db";
// import { organizations, customers } from "@/db/schema";
// import { eq } from "drizzle-orm";

// async function getUserOrganizations(userId: string) {
//   return await db.query.organizations.findMany({
//     where: eq(organizations.userId, userId),
//     with: {
//       customers: true,
//     },
//   });
// }

// import { eq } from 'drizzle-orm'
// import { db } from '@/db'
// import { users, organizations, userOrganizations } from '@/db/schema/users'
// import { hasPermission } from '@/lib/abac'
// import { auth } from '@/lib/auth'
// import { notFound } from 'next/navigation'

// // `/app/(protected)/[id]/organizations/page.tsx`
// export async function getUserOrganizations() {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
//     return []
//   }

//   return await db.query.users.findFirst({
//     where: eq(users.id, session.user.id),
//     with: {
//       userOrganizations: {
//         with: {
//           organization: true
//         }
//       }
//     }
//   })
// }

// // `/app/(protected)/[id]/organizations/[id]/page.tsx`
// export async function getOrganizationById(organizationId: string) {
//   const session = await auth()
//   if (!session?.user || !hasPermission(session.user, 'organizations', 'view')) {
//     return null
//   }

//   const organization = await db.query.organizations.findFirst({
//     where: eq(organizations.id, organizationId),
//     with: {
//       customers: true,
//       userOrganizations: {
//         with: {
//           user: true
//         }
//       }
//     }
//   })

//   if (!organization) {
//     notFound()
//   }

//   return organization
// }

// import { eq } from 'drizzle-orm'
// import { db } from './index'
// import { users, organizations, customers, invoices } from './schema'
// import { hasPermission } from '@/lib/abac'
// import { User } from '@/lib/auth'
// import { notFound } from 'next/navigation'

// export async function getUserOrganizations(user: User) {
//   if (!hasPermission(user, 'organizations', 'view')) {
//     return []
//   }

//   return await db.query.users.findFirst({
//     where: eq(users.id, user.id),
//     with: {
//       userOrganizations: {
//         with: {
//           organization: true
//         }
//       }
//     }
//   })
// }

// export async function getOrganizationCustomers(
//   user: User,
//   organizationId: string
// ) {
//   if (!hasPermission(user, 'customers', 'view')) {
//     return []
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, organizationId))
//     .limit(1)

//   if (!organization) {
//     notFound()
//   }

//   return await db.query.customers.findMany({
//     where: eq(customers.organizationId, organizationId),
//     with: {
//       invoices: {
//         columns: {
//           id: true,
//           status: true,
//           value: true
//         }
//       }
//     }
//   })
// }

// export async function getOrganizationInvoices(
//   user: User,
//   organizationId: string
// ) {
//   if (!hasPermission(user, 'invoices', 'view')) {
//     return []
//   }

//   const [organization] = await db
//     .select()
//     .from(organizations)
//     .where(eq(organizations.id, organizationId))
//     .limit(1)

//   if (!organization) {
//     notFound()
//   }

//   return await db
//     .select({
//       id: invoices.id,
//       value: invoices.value,
//       status: invoices.status,
//       description: invoices.description,
//       customerName: customers.name,
//       customerEmail: customers.email,
//       createdAt: invoices.createdAt
//     })
//     .from(invoices)
//     .innerJoin(customers, eq(invoices.customerId, customers.id))
//     .where(eq(customers.organizationId, organizationId))
// }
