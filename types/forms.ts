import type { z } from "zod"

type FieldError = {
  type: string
  message: string
}

type FieldErrors = {
  [key: string]: FieldError | FieldErrors
  [index: number]: FieldError | FieldErrors
}

type FormData = Record<string, unknown>

type ActionResponse<T extends FormData = FormData> = {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[] | FieldErrors
  }
  inputs?: Partial<T>
  redirect?: string
}

function Action<T extends FormData = FormData>(schema: z.ZodType<T>) {
  return {
    FormData: {} as T,
    ActionResponse: {} as ActionResponse<T>,
  }
}

export { Action }
export type { FieldError, FieldErrors, FormData, ActionResponse }
