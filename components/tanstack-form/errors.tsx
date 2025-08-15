"use client"

import { AnyFieldMeta, StandardSchemaV1Issue } from "@tanstack/react-form"

const Errors = ({ meta }: { meta: AnyFieldMeta }) => {
  const normalizeError = (error: any): string | null => {
    if (!error) return null
    if (typeof error === "string") return error
    if (typeof error === "object" && error.message) return error.message
    if (Array.isArray(error) && error.length > 0) {
      return error[0].message || String(error[0])
    }
    if (typeof error === "object") return JSON.stringify(error)
    return String(error)
  }
  const error =
    meta.errorMap.onDynamic ||
    meta.errorMap.onChange ||
    meta.errorMap.onBlur ||
    meta.errorMap.onSubmit ||
    meta.errors[0]
  const errorMessage = normalizeError(error)
  if (!errorMessage) return null
  return <p className="text-destructive absolute text-sm">{errorMessage}</p>
}

const FieldErrors = ({ meta }: { meta: AnyFieldMeta }) => {
  if (!meta.isTouched) return null
  return (
    <p className="text-destructive text-sm font-medium">
      {meta.errors[0].message}
    </p>
  )
}

const FormErrors = ({
  errors,
}: {
  errors: (string | StandardSchemaV1Issue | null | undefined)[]
}) => {
  if (errors.length < 1) {
    return null
  }
  const error = errors[0]
  if (!error) {
    return null
  }
  if (typeof error === "string") {
    return <div className="text-destructive mt-1 text-sm">{error}</div>
  }
  return <div className="text-rdestructive mt-1 text-sm">{error.message}</div>
}

export { Errors }
