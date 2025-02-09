import { pgEnum } from 'drizzle-orm/pg-core'

const STATUSES = ['open', 'paid', 'void', 'uncollectible'] as const

type Status = (typeof STATUSES)[number]

const statuses = pgEnum('status', STATUSES)

const status: Record<Status, string> = {
  open: '#4285F4',
  paid: '#0F9D58',
  void: '#F4B400',
  uncollectible: '#DB4437'
}

export { STATUSES, type Status, statuses, status }

/**

import { pgEnum } from 'drizzle-orm/pg-core'

const STATUSES = [
  {
    id: 'open' as const,
    label: 'Open',
    color: '#4285F4'
  },
  {
    id: 'paid' as const,
    label: 'Paid',
    color: '#0F9D58'
  },
  {
    id: 'void' as const,
    label: 'Void',
    color: '#F4B400'
  },
  {
    id: 'uncollectible' as const,
    label: 'Uncollectible',
    color: '#DB4437'
  }
] as const

type Status = (typeof STATUSES)[number]['id']

const statuses: Record<Status, { bg: string; text: string }> = {
  open: { bg: 'bg-[#4285F4]', text: 'text-[#4285F4]' },
  paid: { bg: 'bg-[#0F9D58]', text: 'text-[#0F9D58]' },
  void: { bg: 'bg-[#F4B400]', text: 'text-[#F4B400]' },
  uncollectible: { bg: 'bg-[#DB4437]', text: 'text-[#DB4437]' }
}

const STATUS = pgEnum(
  'status',
  STATUSES.map(({ id }) => id) as [Status, ...Array<Status>]
)

export { STATUSES, type Status, statuses, STATUS }

*/
