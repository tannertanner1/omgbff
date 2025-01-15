import { z } from 'zod'

export const invoiceSchema = z.object({
  customerId: z.string().min(1, { message: 'Customer is required' }),
  amount: z.string().min(1, { message: 'Amount is required' }),
  description: z.string().min(1, { message: 'Description is required' })
})
