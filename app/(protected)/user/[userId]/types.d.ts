export interface FormData {
  name: string
}

export interface ActionResponse {
  success: boolean
  message: string
  errors?: {
    [key: string]: string[]
  }
  inputs?: {
    [K in keyof FormData]?: string
  }
  organizationId?: string
}
