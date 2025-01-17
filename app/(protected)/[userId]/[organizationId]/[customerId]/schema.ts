import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(1, { message: 'Name required' }),
  email: z.string().email({ message: 'Invalid email' })
})
