import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { customerId, invoiceId, createdAt, updatedAt } from '@/db/helpers'
import { relations } from 'drizzle-orm'
import { organizations, users } from './users'
import { InferInsertModel } from 'drizzle-orm'
import { STATUSES } from '@/data/invoice-statuses'

const customers = pgTable('customers', {
  id: customerId,
  // Optionally remove organizationId
  organizationId: text()
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text()
    .notNull()
    .references(() => users.id),
  createdAt,
  updatedAt,
  /** email, name */
  email: text().notNull(),
  name: text().notNull()
})

// const organizationCustomers = pgTable(
//   'organizationCustomers',
//   {
//     organizationId: text()
//       .notNull()
//       .references(() => organizations.id, { onDelete: 'cascade' }),
//     customerId: integer()
//       .notNull()
//       .references(() => customers.id, { onDelete: 'cascade' }),
//     createdAt,
//     updatedAt
//   },
//   organizationCustomers => [
//     primaryKey({
//       columns: [
//         organizationCustomers.organizationId,
//         organizationCustomers.customerId
//       ]
//     })
//   ]
// )

const invoices = pgTable('invoices', {
  id: invoiceId,
  // Optionally remove `customerId`
  customerId: text()
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  userId: text()
    .notNull()
    .references(() => users.id),
  value: integer().notNull(),
  description: text(),
  status: text('status', { enum: STATUSES }).notNull().default('open'),
  createdAt,
  updatedAt
})

// const customerInvoices = pgTable('customerInvoices', {
//   customerId: text()
//     .notNull()
//     .references(() => customers.id, { onDelete: 'cascade' }),
//   invoiceId: text()
//     .notNull()
//     .references(() => invoices.id, { onDelete: 'cascade' }),
//   amount: integer().notNull(),
//   createdAt,
//   updatedAt
//   }, customerInvoices => [
//     primaryKey({
//       columns: [customerInvoices.customerId, customerInvoices.invoiceId]
//     })
//   ]
// )

// const organizationsRelations = relations(organizations, ({ many }) => ({
//   customers: many(organizationCustomers),
// }));

const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id]
  }),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id]
  }),
  invoices: many(invoices)
}))
// const customersRelations = relations(customers, ({ many }) => ({
//   invoices: many(customerInvoices),
// }));

const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id]
  }),
  // customers: many(customerInvoices),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id]
  })
}))

export { customers, invoices, customersRelations, invoicesRelations }

export type NewCustomer = InferInsertModel<typeof customers>
export type NewInvoice = InferInsertModel<typeof invoices>

/**
 * @see https://youtu.be/Mcw8Mp8PYUE?si=vuf6VVt5Jv-AXct3
 * @see https://github.com/colbyfayock/my-invoicing-app
 */
