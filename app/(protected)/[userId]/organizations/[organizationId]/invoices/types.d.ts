import type { Status } from '@/data/invoice-statuses'

export type FormData = {
  description: string
  value: number
  status: Status
  organizationId: string
  customerId: number
}

export type ActionResponse = {
  success: boolean
  message: string
  errors?: {
    [K in keyof FormData]?: string[]
  }
  inputs?: {
    [K in keyof FormData]?: string | number
  }
  invoiceId?: string
  redirect?: string
}
