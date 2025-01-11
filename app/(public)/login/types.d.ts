export interface FormData {
  email: string
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
}
