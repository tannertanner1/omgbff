import type { z } from 'zod'

export interface Field {
  name: string
  label: string
  type?: 'text' | 'email' | 'number' | 'textarea'
  required?: boolean
}

export interface FormState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  inputs?: Record<string, string>
}

export interface FormProps {
  fields: Field[]
  action: (prevState: FormState, formData: FormData) => Promise<FormState>
  button?: string
  redirectPath?: string
}

// import type { z } from 'zod'
// import type { FormData as GlobalFormData } from 'node_modules/typescript/lib/lib.dom'

// export interface Field {
//   name: string
//   label: string
//   type?: 'text' | 'email' | 'number' | 'textarea'
//   required?: boolean
// }

// export interface FormState {
//   success?: boolean
//   message?: string
//   errors?: Record<string, string[]>
//   inputs?: Record<string, string>
// }

// export interface FormProps<T extends z.ZodType<any, any>> {
//   fields: Field[]
//   action: (prevState: FormState, formData: GlobalFormData) => Promise<FormState>
//   schema: T
//   button?: string
// }

// export type FormValues<T extends z.ZodType<any, any>> = z.infer<T>

// export interface Field {
//   name: string
//   label: string
//   type?: 'text' | 'email' | 'number' | 'textarea'
//   required?: boolean
// }

// export interface FormState {
//   success?: boolean
//   message?: string
//   errors?: Record<string, string>
//   inputs?: Record<string, string>
// }

// export interface FormProps {
//   fields: Field[]
//   action: (prevState: FormState, formData: FormData) => Promise<FormState>
//   button?: string
// }

// export interface Field {
//   name: string
//   label: string
//   type?: 'text' | 'email' | 'number' | 'textarea'
//   required?: boolean
// }

// export interface FormState {
//   success?: boolean
//   message?: string
//   errors?: Record<string, string>
//   inputs?: Record<string, string>
// }

// export interface FormProps {
//   fields: Field[]
//   action: (formData: FormData) => Promise<FormState>
//   button?: string
// }
