import { z } from 'zod'

export const schema = z.object({
  name: z
    .string()
    .max(32, { message: 'Name must be at most 32 characters' })
    .optional(),
  email: z.string().email({ message: 'Invalid email' }),
  message: z
    .string()
    .min(2, { message: 'Message required' })
    .max(1000, { message: 'Message must be at most 1000 characters' })
})
