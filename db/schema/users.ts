import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import { InferInsertModel } from 'drizzle-orm'

const users = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text('email').unique(),

    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    name: text('name'),
    role: text('role', { enum: ['owner', 'admin', 'user'] })
      .notNull()
      .default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
  },
  user => [uniqueIndex('unique_idx').on(user.email)]
)

const accounts = pgTable(
  'account',
  {
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    type: text('type').$type<AdapterAccountType>().notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  account => [
    primaryKey({
      columns: [account.provider, account.providerAccountId]
    })
  ]
)

const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  expires: timestamp('expires', { mode: 'date' }).notNull()
})

const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),

    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  verificationToken => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token]
    })
  ]
)

export { users, accounts, sessions, verificationTokens }

export type NewUser = InferInsertModel<typeof users>
export type NewSession = InferInsertModel<typeof sessions>

/** @see https://authjs.dev/getting-started/adapters/drizzle#schemas */
