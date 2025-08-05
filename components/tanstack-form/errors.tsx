import { AnyFieldMeta } from "@tanstack/react-form"
import { ZodError } from "zod"

const Errors = ({ meta }: { meta: AnyFieldMeta }) => {
  if (!meta.isTouched) return null

  return meta.errors.map(({ message }: ZodError, index) => (
    <p key={index} className="text-destructive text-sm font-medium">
      {message}
    </p>
  ))
}

export { Errors }
