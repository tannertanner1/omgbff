import { text, timestamp } from 'drizzle-orm/pg-core'
import { customAlphabet } from 'nanoid'

const nanoId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)
const customerNanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 12)
const invoiceNanoId = customAlphabet('0123456789', 12)

const id = text()
  .primaryKey()
  .$defaultFn(() => nanoId())
// text().primaryKey().$defaultFn(() => crypto.randomUUID())
// uuid().primaryKey().defaultRandom()
const customerId = text()
  .primaryKey()
  .$defaultFn(() => customerNanoId())
const invoiceId = text()
  .primaryKey()
  .$defaultFn(() => invoiceNanoId())
// serial().primaryKey().notNull()

const createdAt = timestamp({ withTimezone: true }).notNull().defaultNow()
const updatedAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export { id, customerId, invoiceId, createdAt, updatedAt }

/**
 * @see https://planetscale.com/blog/why-we-chose-nanoids-for-planetscales-api
 * @see https://zelark.github.io/nano-id-cc
 * @see https://github.com/WebDevSimplified/course-platform/blob/082e1fce0c80dd14a0bdda44ef51b76b9a3b749e/src/drizzle/schemaHelpers.ts
 */
