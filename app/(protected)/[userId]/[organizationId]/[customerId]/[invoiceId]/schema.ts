import { z } from 'zod'

export const invoiceSchema = z.object({
  customerId: z.string().min(1, { message: 'Customer required' }),
  amount: z.string().min(1, { message: 'Amount required' }),
  description: z.string().min(1, { message: 'Description required' })
})
