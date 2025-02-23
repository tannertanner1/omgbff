import type { z } from 'zod'

export type FieldError = {
  type: string
  message: string
}

export type NestedFieldErrors = {
  [key: string]: FieldError | NestedFieldErrors
  [index: number]: FieldError | NestedFieldErrors
}

export type FormData = Record<string, unknown>

export type ActionResponse<T extends FormData = FormData> = {
  success: boolean
  message: string
  errors?: {
    [K in keyof T]?: string[] | NestedFieldErrors
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

// import { z } from 'zod'

// export type FormData = Record<string, unknown>

// export type ActionResponse<T extends FormData = FormData> = {
//   success: boolean
//   message: string
//   errors?: {
//     [K in keyof T]?: string[]
//   }
//   inputs?: Partial<T>
//   redirect?: string
// }

// export function Action<T extends FormData = FormData>(schema: z.ZodType<T>) {
//   return {
//     FormData: {} as T,
//     ActionResponse: {} as ActionResponse<T>
//   }
// }
