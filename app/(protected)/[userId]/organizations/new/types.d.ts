export type FormData = {
  name: string
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
  organizationId?: string
  redirect?: string
}
