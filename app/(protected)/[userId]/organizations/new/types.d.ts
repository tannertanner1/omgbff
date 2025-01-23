export interface FormData {
  name: string
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
  organizationId?: number
}
