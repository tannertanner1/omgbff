import { z } from "zod"
import { formOptions, revalidateLogic } from "@tanstack/react-form/nextjs"

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
    onChange: schema,
  },
  canSubmitWhenInvalid: false,
  validationLogic: revalidateLogic({
    mode: "submit",
    modeAfterSubmission: "change",
  }),
})

export { schema, data }
