import { z } from 'zod'

export const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Email required'),
  organizationId: z.string().min(1, 'Organization required')
})

export type Schema = z.infer<typeof schema>
