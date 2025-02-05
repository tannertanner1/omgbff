export type FormData = {
  name: string
  email: string
  organizationId: string
}

export type ActionResponse = {
  success: boolean
  message: string
  errors?: {
    [K in keyof FormData]?: string[]
  }
  inputs?: {
    [K in keyof FormData]?: string
  }
  customerId?: string
  redirect?: string
}
