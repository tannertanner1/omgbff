import { AnyFieldMeta } from "@tanstack/react-form"

const Errors = ({ meta }: { meta: AnyFieldMeta }) => {
  const error = (error: any): string | null => {
    if (!error) return null
    if (typeof error === "string") return error
    if (typeof error === "object" && error.message) return error.message
    if (Array.isArray(error) && error.length > 0) {
      return error[0].message || String(error[0])
    }
    if (typeof error === "object") return JSON.stringify(error)
    return String(error)
  }

  const message = error(meta.errors[0])

  if (!message) return null
  return <p className="text-destructive absolute text-sm">{message}</p>
}

export { Errors }
