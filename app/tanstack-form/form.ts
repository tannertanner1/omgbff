import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
})
type Schema = z.infer<typeof schema>

const data = formOptions({
  defaultValues: {
    name: "",
  } as Schema,
})

export { schema, data }
