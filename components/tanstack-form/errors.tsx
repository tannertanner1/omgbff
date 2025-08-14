import { AnyFieldMeta, StandardSchemaV1Issue } from "@tanstack/react-form"
import { ZodError } from "zod"

const Errors = ({ meta }: { meta: AnyFieldMeta }) => {
  if (!meta.isTouched) return null

  const firstError = meta.errors[0] as ZodError
  if (!firstError) return null

  return (
    <p className="text-destructive text-sm font-medium">{firstError.message}</p>
  )
}

const FormError = ({
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

export { Errors, FormError }
