import { pgEnum } from 'drizzle-orm/pg-core'

const ROLES = ['owner', 'admin', 'user'] as const

type Role = (typeof ROLES)[number]

const roles = pgEnum('role', ROLES)

const role: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  user: 'User'
}

export { ROLES, type Role, roles, role }

// import { pgEnum } from 'drizzle-orm/pg-core'

// export const roles = ['owner', 'admin', 'user'] as const
// export type Role = (typeof roles)[number]
// export const roleEnum = pgEnum('role', roles)

// import { pgEnum } from 'drizzle-orm/pg-core'

// const ROLES = ['owner', 'admin', 'user'] as const
// type Role = (typeof ROLES)[number]
// const rolesEnum = pgEnum('role', ROLES)

// const role: Record<Role, string> = {
//   owner: 'Owner',
//   admin: 'Admin',
//   user: 'User'
// }

// export { ROLES, type Role, rolesEnum, role }

/**

import { pgEnum } from 'drizzle-orm/pg-core'

const ROLES = [
  { id: 'owner' as const, label: 'Owner' },
  { id: 'admin' as const, label: 'Admin' },
  { id: 'user' as const, label: 'User' }
] as const

type Role = (typeof ROLES)[number]['id']

const roles = pgEnum(
  'role',
  ROLES.map(({ id }) => id) as [Role, ...Array<Role>]
)

const role: Record<Role, string> = ROLES.reduce(
  (acc, role) => {
    acc[role.id] = role.label
    return acc
  },
  {} as Record<Role, string>
)

export { ROLES, type Role, roles, role }

*/
