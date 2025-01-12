export interface FormData {
  name: string
  email: string
  value: string
  description: string
}

export interface ActionResponse {
  success: boolean
  message: string
  errors?: {
    [K in keyof FormData]?: string[]
  }
  inputs?: {
    [K in keyof FormData]?: string
  }
  invoiceId?: number
}
