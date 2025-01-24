/**

// USAGE 🤔 ?
const user: User = { id: '1', role: 'owner' }
const organization: Organization = {
  id: 'o1',
  name: 'Team',
  userId: 'u1'
}
const customer: Customer = {
  id: 'c1',
  name: 'Bob',
  email: 'bob@example.com',
  organizationId: 'o1'
}
const invoice: Invoice = {
  id: 'i1',
  customerId: 'c1',
  amount: 100,
  organizationId: 'o1'
}

// Can create an organization
console.log(
  hasPermission(user, 'organizations', 'create', organization, organization)
)

// Can view the customer
console.log(hasPermission(user, 'customers', 'view', customer, organization))

// Can update the invoice
console.log(hasPermission(user, 'invoices', 'update', invoice, organization))

// A member trying to create a customer
const memberUser: User = { id: '2', role: 'member' }
console.log(
  hasPermission(memberUser, 'customers', 'create', customer, organization)
)

*/

import type { Role } from '@/data/system-roles'

type Organization = {
  id: string
  name: string
}

type Customer = {
  id: string
  name: string
  email: string
  organizationId: string
}

type Invoice = {
  id: string
  customerId: string
  amount: number
  organizationId: string
}

type User = {
  id: string
  email: string
  role: Role
  name: string | null
  emailVerified: Date | null
  image: string | null
}

type PermissionCheck<T> = boolean | ((user: User, data?: T) => boolean)

type Permissions = {
  organizations: {
    dataType: Organization
    action: 'view' | 'create' | 'update' | 'delete'
  }
  customers: {
    dataType: Customer
    action: 'view' | 'create' | 'update' | 'delete'
  }
  invoices: {
    dataType: Invoice
    action: 'view' | 'create' | 'update' | 'delete'
  }
}

const PERMISSION_RULES: {
  [Resource in keyof Permissions]: {
    [Action in Permissions[Resource]['action']]: PermissionCheck<
      Permissions[Resource]['dataType']
    >
  }
} = {
  organizations: {
    view: true,
    create: true,
    update: (user, organization) =>
      user.role === 'owner' || user.role === 'admin',
    delete: (user, organization) => user.role === 'owner'
  },
  customers: {
    view: true,
    create: user => user.role === 'owner' || user.role === 'admin',
    update: user => user.role === 'owner' || user.role === 'admin',
    delete: user => user.role === 'owner' || user.role === 'admin'
  },
  invoices: {
    view: true,
    create: user => user.role === 'owner' || user.role === 'admin',
    update: user => user.role === 'owner' || user.role === 'admin',
    delete: user => user.role === 'owner' || user.role === 'admin'
  }
}

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]['action'],
  data?: Permissions[Resource]['dataType']
): boolean {
  const permissionCheck = PERMISSION_RULES[resource][action]
  return typeof permissionCheck === 'boolean'
    ? permissionCheck
    : permissionCheck(user, data)
}
