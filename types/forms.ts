import { z } from 'zod'

export type FormData = Record<string, unknown>

export type ActionResponse<T extends FormData = FormData> = {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[]
  }
  inputs?: Partial<T>
  redirect?: string
}

export function Action<T extends FormData = FormData>(schema: z.ZodType<T>) {
  return {
    FormData: {} as T,
    ActionResponse: {} as ActionResponse<T>
  }
}
