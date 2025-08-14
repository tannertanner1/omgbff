import { z } from "zod"
import {
  formOptions,
  // revalidateLogic
} from "@tanstack/react-form/nextjs"

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  email: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Invalid" }),
})
type Schema = z.infer<typeof schema>

const data = formOptions({
  defaultValues: {
    name: "",
    email: "",
  } as Schema,
  validator: {
    onSubmit: schema,
    name: ({ value }) => {
      if (!value) return "Name is required"
      return undefined
    },
    email: ({ value }) => {
      if (!value) return "Email is required"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
      return undefined
    },
  },
  canSubmitWhenInvalid: false,
  validationLogic: {
    mode: "submit",
    modeAfterSubmission: "change",
  },
})

export { schema, data }
