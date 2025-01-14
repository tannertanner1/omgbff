import { z } from 'zod'

export const schema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name required' })
    .max(100, { message: 'Name must be at most 100 characters' })
})
