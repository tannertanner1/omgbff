import { z } from 'zod'
import { STATUS } from '@/data/invoice-statuses'

export const schema = z.object({
  description: z.string().min(1, 'Description required'),
  value: z.number().min(0, 'Value must be positive'),
  status: z.enum(STATUS.enumValues, {
    required_error: 'Status required',
    invalid_type_error: 'Invalid status'
  }),
  organizationId: z.string().min(1, 'Organization required'),
  customerId: z.number().int().positive('Customer required')
})

export type Schema = z.infer<typeof schema>
