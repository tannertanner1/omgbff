export interface FormData {
  name: string
  message: string
}

export interface ActionResponse {
  success: boolean
  message: string
  errors?: {
    [K in keyof FormData]?: string[]
  }
  inputs: FormData
}
