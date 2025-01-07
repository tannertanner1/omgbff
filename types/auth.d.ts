export interface LoginFormData {
  email: string
}

export interface ActionResponse {
  success: boolean
  message: string
  errors?: {
    [K in keyof LoginFormData]?: string[]
  }
  inputs?: {
    [K in keyof LoginFormData]?: string
  }
}
