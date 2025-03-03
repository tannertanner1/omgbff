import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import { id, createdAt, updatedAt } from '@/db/helpers'
import { ROLES } from '@/data/system-roles'
import { relations } from 'drizzle-orm'
import type { AdapterAccountType } from 'next-auth/adapters'
import { InferInsertModel } from 'drizzle-orm'

const users = pgTable(
  'users',
  {
    id,
    organizationId: text().references(() => organizations.id, {
      onDelete: 'set null'
    }),
    emailVerified: timestamp({ mode: 'date' }),
    image: text(),
    name: text(),
    createdAt,
    updatedAt,
    status: text('status', { enum: ['active', 'pending'] })
      .notNull()
      .default('pending'),
    /** @note role, email */
    role: text('role', { enum: ROLES }).notNull().default('user'),
    email: text().unique()
  },
  users => [uniqueIndex().on(users.email)]
)

const organizations = pgTable('organizations', {
  id,
  createdAt,
  updatedAt,
  /** @note name */
  name: text().notNull()
})

const userOrganizations = pgTable(
  'userOrganizations',
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: text()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ROLES }).notNull().default('user'),
    createdAt,
    updatedAt
  },
  userOrganizations => [
    primaryKey({
      columns: [userOrganizations.userId, userOrganizations.organizationId]
    })
  ]
)

const invitations = pgTable('invitations', {
  id,
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text()
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  token: text().notNull(),
  expiresAt: timestamp({ mode: 'date' }).notNull(),
  createdAt,
  updatedAt,
  /** @note role, email */
  role: text('role', { enum: ROLES }).notNull().default('user'),
  email: text().notNull()
})

const accounts = pgTable(
  'accounts',
  {
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text().$type<AdapterAccountType>().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text()
  },
  accounts => [
    primaryKey({
      columns: [accounts.provider, accounts.providerAccountId]
    })
  ]
)

const sessions = pgTable('sessions', {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp({ mode: 'date' }).notNull()
})

const verificationTokens = pgTable(
  'verificationTokens',
  {
    token: text().notNull(),
    identifier: text().notNull(),
    expires: timestamp({ mode: 'date' }).notNull()
  },
  verificationTokens => [
    primaryKey({
      columns: [verificationTokens.identifier, verificationTokens.token]
    })
  ]
)

const usersRelations = relations(users, ({ many }) => ({
  userOrganizations: many(userOrganizations),
  invitations: many(invitations)
}))

const organizationsRelations = relations(organizations, ({ many }) => ({
  userOrganizations: many(userOrganizations),
  invitations: many(invitations)
}))

const userOrganizationsRelations = relations(userOrganizations, ({ one }) => ({
  user: one(users, {
    fields: [userOrganizations.userId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [userOrganizations.organizationId],
    references: [organizations.id]
  })
}))

const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id]
  })
}))

export {
  organizations,
  users,
  userOrganizations,
  invitations,
  accounts,
  sessions,
  verificationTokens,
  usersRelations,
  organizationsRelations,
  userOrganizationsRelations,
  invitationsRelations
}

export type NewOrganization = InferInsertModel<typeof organizations>
export type NewUser = InferInsertModel<typeof users>
export type NewSession = InferInsertModel<typeof sessions>
export type NewInvitation = InferInsertModel<typeof invitations>

/**
 * @see https://authjs.dev/getting-started/adapters/drizzle#schemas
 * @see https://github.com/WebDevSimplified/course-platform/blob/082e1fce0c80dd14a0bdda44ef51b76b9a3b749e/src/drizzle/schema/user.ts
 */
