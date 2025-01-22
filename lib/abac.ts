/**

// USAGE:
const user: User = { id: '1', role: 'owner' }
const organization: Organization = {
  id: 'org1',
  name: 'My Org',
  creatorId: '1'
}
const customer: Customer = {
  id: 'cust1',
  name: 'John Doe',
  email: 'john@example.com',
  organizationId: 'org1'
}
const invoice: Invoice = {
  id: 'inv1',
  customerId: 'cust1',
  amount: 100,
  organizationId: 'org1'
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
    view: true, // Everyone can view organizations
    create: true, // Everyone can create organizations - this was the issue
    update: (user, org) => user.role === 'owner' || user.role === 'admin',
    delete: (user, org) => user.role === 'owner'
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

// import type { Role } from '@/data/system-roles'

// type Organization = {
//   id: string
//   name: string
// }

// type Customer = {
//   id: string
//   name: string
//   email: string
//   organizationId: string
// }

// type Invoice = {
//   id: string
//   customerId: string
//   amount: number
//   organizationId: string
// }

// type User = {
//   id: string
//   email: string
//   role: Role
//   name: string | null
//   emailVerified: Date | null
//   image: string | null
// }

// type PermissionCheck<T> = boolean | ((user: User, data?: T) => boolean)

// type Permissions = {
//   organizations: {
//     dataType: Organization
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   customers: {
//     dataType: Customer
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   invoices: {
//     dataType: Invoice
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
// }

// const PERMISSION_RULES: {
//   [Resource in keyof Permissions]: {
//     [Action in Permissions[Resource]['action']]: PermissionCheck<
//       Permissions[Resource]['dataType']
//     >
//   }
// } = {
//   organizations: {
//     view: () => true,
//     create: user => user.role === 'owner' || user.role === 'admin',
//     update: user => user.role === 'owner' || user.role === 'admin',
//     delete: user => user.role === 'owner'
//   },
//   customers: {
//     view: () => true,
//     create: user => user.role === 'owner' || user.role === 'admin',
//     update: user => user.role === 'owner' || user.role === 'admin',
//     delete: user => user.role === 'owner' || user.role === 'admin'
//   },
//   invoices: {
//     view: () => true,
//     create: user => user.role === 'owner' || user.role === 'admin',
//     update: user => user.role === 'owner' || user.role === 'admin',
//     delete: user => user.role === 'owner' || user.role === 'admin'
//   }
// }

// export function hasPermission<Resource extends keyof Permissions>(
//   user: User,
//   resource: Resource,
//   action: Permissions[Resource]['action'],
//   data?: Permissions[Resource]['dataType']
// ): boolean {
//   const permissionCheck = PERMISSION_RULES[resource][action]
//   return typeof permissionCheck === 'boolean'
//     ? permissionCheck
//     : permissionCheck(user, data)
// }

// import type { Role } from "@/data/system-roles"

// type Organization = {
//   id: string
//   name: string
//   creatorId: string
// }

// type Customer = {
//   id: string
//   name: string
//   email: string
//   organizationId: string
// }

// type Invoice = {
//   id: string
//   customerId: string
//   amount: number
//   organizationId: string
// }

// type User = {
//   id: string
//   email: string
//   role: Role
//   name: string | null
//   emailVerified: Date | null
//   image: string | null
// }

// type PermissionCheck<T> = boolean | ((user: User, data: T) => boolean)

// type Permissions = {
//   organizations: {
//     dataType: Organization
//     action: "view" | "create" | "update" | "delete"
//   }
//   customers: {
//     dataType: Customer
//     action: "view" | "create" | "update" | "delete"
//   }
//   invoices: {
//     dataType: Invoice
//     action: "view" | "create" | "update" | "delete"
//   }
// }

// const PERMISSION_RULES: {
//   [Resource in keyof Permissions]: {
//     [Action in Permissions[Resource]["action"]]: PermissionCheck<Permissions[Resource]["dataType"]>
//   }
// } = {
//   organizations: {
//     view: () => true,
//     create: (user) => user.role === "owner" || user.role === "admin",
//     update: (user, org) => user.role === "owner" || (user.role === "admin" && user.id === org.creatorId),
//     delete: (user, org) => user.role === "owner" && user.id === org.creatorId,
//   },
//   customers: {
//     view: () => true,
//     create: (user) => user.role === "owner" || user.role === "admin",
//     update: (user) => user.role === "owner" || user.role === "admin",
//     delete: (user) => user.role === "owner" || user.role === "admin",
//   },
//   invoices: {
//     view: () => true,
//     create: (user) => user.role === "owner" || user.role === "admin",
//     update: (user) => user.role === "owner" || user.role === "admin",
//     delete: (user) => user.role === "owner" || user.role === "admin",
//   },
// }

// export function hasPermission<Resource extends keyof Permissions>(
//   user: User,
//   resource: Resource,
//   action: Permissions[Resource]["action"],
//   data?: Permissions[Resource]["dataType"],
// ): boolean {
//   const permissionCheck = PERMISSION_RULES[resource][action]
//   return typeof permissionCheck === "boolean" ? permissionCheck : data ? permissionCheck(user, data) : false
// }

// import type { Role } from './auth'
// import type { Role } from '@/data/system-roles'

// type Organization = {
//   id: string
//   name: string
//   creatorId: string
// }

// type Customer = {
//   id: string
//   name: string
//   email: string
//   organizationId: string
// }

// type Invoice = {
//   id: string
//   customerId: string
//   amount: number
//   organizationId: string
// }

// type User = {
//   id: string
//   email: string
//   role: Role
//   name: string | null
//   emailVerified: Date | null
//   image: string | null
// }

// type PermissionCheck<T> = boolean | ((user: User, data: T) => boolean)

// type Permissions = {
//   organizations: {
//     dataType: Organization
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   customers: {
//     dataType: Customer
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   invoices: {
//     dataType: Invoice
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
// }

// const PERMISSION_RULES: {
//   [Resource in keyof Permissions]: {
//     [Action in Permissions[Resource]['action']]: PermissionCheck<
//       Permissions[Resource]['dataType']
//     >
//   }
// } = {
//   organizations: {
//     view: (user, org) => user.role === 'owner' && user.id === org.creatorId,
//     create: user => user.role === 'owner' || user.role === 'admin',
//     update: (user, org) => user.role === 'owner' && user.id === org.creatorId,
//     delete: (user, org) => user.role === 'owner' && user.id === org.creatorId
//   },
//   customers: {
//     view: () => true,
//     create: user => user.role === 'owner' || user.role === 'admin',
//     update: user => user.role === 'owner' || user.role === 'admin',
//     delete: user => user.role === 'owner' || user.role === 'admin'
//   },
//   invoices: {
//     view: () => true,
//     create: user => user.role === 'owner' || user.role === 'admin',
//     update: user => user.role === 'owner' || user.role === 'admin',
//     delete: user => user.role === 'owner' || user.role === 'admin'
//   }
// }

// export function hasPermission<Resource extends keyof Permissions>(
//   user: User,
//   resource: Resource,
//   action: Permissions[Resource]['action'],
//   data?: Permissions[Resource]['dataType']
// ): boolean {
//   const permissionCheck = PERMISSION_RULES[resource][action]
//   return typeof permissionCheck === 'boolean'
//     ? permissionCheck
//     : data
//       ? permissionCheck(user, data)
//       : false
// }

// type Organization = {
//   id: string
//   name: string
//   creatorId: string
// }

// type Customer = {
//   id: string
//   name: string
//   email: string
//   organizationId: string
// }

// type Invoice = {
//   id: string
//   customerId: string
//   amount: number
//   organizationId: string
// }

// type User = {
//   id: string
//   role: 'owner' | 'member'
// }

// type PermissionCheck<T> = boolean | ((user: User, data: T) => boolean)

// type Permissions = {
//   organizations: {
//     dataType: Organization
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   customers: {
//     dataType: Customer
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   invoices: {
//     dataType: Invoice
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
// }

// const PERMISSION_RULES: {
//   [Resource in keyof Permissions]: {
//     [Action in Permissions[Resource]['action']]: PermissionCheck<
//       Permissions[Resource]['dataType']
//     >
//   }
// } = {
//   organizations: {
//     view: (user, org) => user.role === 'owner' && user.id === org.creatorId,
//     create: () => true,
//     update: (user, org) => user.role === 'owner' && user.id === org.creatorId,
//     delete: (user, org) => user.role === 'owner' && user.id === org.creatorId
//   },
//   customers: {
//     view: () => true,
//     create: user => user.role === 'owner',
//     update: user => user.role === 'owner',
//     delete: user => user.role === 'owner'
//   },
//   invoices: {
//     view: () => true,
//     create: user => user.role === 'owner',
//     update: user => user.role === 'owner',
//     delete: user => user.role === 'owner'
//   }
// }

// export function hasPermission<Resource extends keyof Permissions>(
//   user: User,
//   resource: Resource,
//   action: Permissions[Resource]['action'],
//   data?: Permissions[Resource]['dataType']
// ): boolean {
//   const permissionCheck = PERMISSION_RULES[resource][action]
//   return typeof permissionCheck === 'boolean'
//     ? permissionCheck
//     : data
//       ? permissionCheck(user, data)
//       : false
// }

// type Organization = {
//   id: string
//   name: string
//   creatorId: string
// }

// type Customer = {
//   id: string
//   name: string
//   email: string
//   organizationId: string
// }

// type Invoice = {
//   id: string
//   customerId: string
//   amount: number
//   organizationId: string
// }

// type User = {
//   id: string
//   role: 'owner' | 'member'
// }

// type PermissionCheck<Key extends keyof Permissions> =
//   | boolean
//   | ((user: User, data: Permissions[Key]['dataType']) => boolean)

// type RolesWithPermissions = {
//   [R in User['role']]: Partial<{
//     [Key in keyof Permissions]: Partial<{
//       [Action in Permissions[Key]['action']]: PermissionCheck<Key>
//     }>
//   }>
// }

// type Permissions = {
//   organizations: {
//     dataType: Organization
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   customers: {
//     dataType: Customer
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
//   invoices: {
//     dataType: Invoice
//     action: 'view' | 'create' | 'update' | 'delete'
//   }
// }

// const ROLES = {
//   owner: {
//     organizations: {
//       view: (user, org) => user.id === org.creatorId,
//       create: true,
//       update: (user, org) => user.id === org.creatorId,
//       delete: (user, org) => user.id === org.creatorId
//     },
//     customers: {
//       view: (user, customer, org) => user.id === org.creatorId,
//       create: (user, customer, org) => user.id === org.creatorId,
//       update: (user, customer, org) => user.id === org.creatorId,
//       delete: (user, customer, org) => user.id === org.creatorId
//     },
//     invoices: {
//       view: (user, invoice, org) => user.id === org.creatorId,
//       create: (user, invoice, org) => user.id === org.creatorId,
//       update: (user, invoice, org) => user.id === org.creatorId,
//       delete: (user, invoice, org) => user.id === org.creatorId
//     }
//   },
//   member: {
//     organizations: {
//       view: true,
//       create: false,
//       update: false,
//       delete: false
//     },
//     customers: {
//       view: true,
//       create: false,
//       update: false,
//       delete: false
//     },
//     invoices: {
//       view: true,
//       create: false,
//       update: false,
//       delete: false
//     }
//   }
// } as const satisfies RolesWithPermissions

// export function hasPermission<Resource extends keyof Permissions>(
//   user: User,
//   resource: Resource,
//   action: Permissions[Resource]['action'],
//   data: Permissions[Resource]['dataType'],
//   organization: Organization
// ) {
//   const permission = ROLES[user.role][resource]?.[action]
//   if (permission == null) return false

//   if (typeof permission === 'boolean') return permission
//   return permission(user, data, organization)
// }
