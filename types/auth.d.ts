export interface AuthFormData {
  email: string
}

export interface ActionResponse {
  success: boolean
  message: string
  errors?: {
    [K in keyof AuthFormData]?: string[]
  }
  inputs?: {
    [K in keyof AuthFormData]?: string
  }
}
