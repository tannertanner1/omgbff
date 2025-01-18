import { z } from 'zod'

export const schema = z.object({
  name: z
    .string()
    .max(32, { message: 'Name must be at most 32 characters' })
    .optional(),
  message: z
    .string()
    .min(1, { message: 'Message required' })
    .max(1000, { message: 'Message must be at most 1000 characters' })
})
