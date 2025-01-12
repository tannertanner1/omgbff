import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { InferInsertModel } from 'drizzle-orm'

const STATUSES = [
  { id: 'open', label: 'Open' },
  { id: 'paid', label: 'Paid' },
  { id: 'void', label: 'Void' },
  { id: 'uncollectible', label: 'Uncollectible' }
]

export type Status = (typeof STATUSES)[number]['id']

const statuses = STATUSES.map(({ id }) => id) as Array<Status>

export const statusEnum = pgEnum(
  'status',
  statuses as [Status, ...Array<Status>]
)

const invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  customerId: integer('customerId')
    .notNull()
    .references(() => customers.id),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  organizationId: text('organizationId'),

  createdAt: timestamp('createdAt').defaultNow().notNull(),
  value: integer('value').notNull(),
  description: text('description').notNull(),
  status: statusEnum('status').notNull()
})

const customers = pgTable('customers', {
  id: serial('id').primaryKey().notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  organizationId: text('organizationId'),

  createdAt: timestamp('createdAt').defaultNow().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull()
})

export { invoices, customers }

export type NewInvoice = InferInsertModel<typeof invoices>
export type NewCustomer = InferInsertModel<typeof customers>

/**
 * @see https://youtu.be/Mcw8Mp8PYUE?si=vuf6VVt5Jv-AXct3
 * @see https://github.com/colbyfayock/my-invoicing-app
 */
