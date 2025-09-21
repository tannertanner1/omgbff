import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, "Required").email("Invalid"),
  message: z.string().min(1, "Required"),
  files: z.array(z.instanceof(File)).optional(),
})
type Schema = z.infer<typeof schema>

const data = formOptions({
  defaultValues: {
    name: "",
    email: "",
    message: "",
    files: [],
  } as Schema,
})

export { schema, data }
