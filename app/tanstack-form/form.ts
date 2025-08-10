import { z } from "zod"
import { formOptions } from "@tanstack/react-form/nextjs"

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  email: z.string().email({ message: "Invalid" }),
})
type Schema = z.infer<typeof schema>

const data = formOptions({
  defaultValues: {
    name: "",
    email: "",
  } as Schema,
  validators: {
    onSubmit: schema,
  },
  canSubmitWhenInvalid: false,
})

export { data, schema }
