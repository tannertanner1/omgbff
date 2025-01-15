import { z } from 'zod'

export const schema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email' }),
  value: z.string().min(1, { message: 'Amount required' }),
  description: z.string().min(2, { message: 'Description required' })
})
