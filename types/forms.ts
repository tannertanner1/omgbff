import type { z } from 'zod'

export type FieldError = {
  type: string
  message: string
}

export type FieldErrors = {
  [key: string]: FieldError | FieldErrors
  [index: number]: FieldError | FieldErrors
}

export type FormData = Record<string, unknown>

export type ActionResponse<T extends FormData = FormData> = {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[] | FieldErrors
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
