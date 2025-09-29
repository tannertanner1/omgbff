import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().optional(),
  email: z.string().min(1, "Required").email("Invalid"),
  message: z.string().min(1, "Required"),
  files: z
    .array(z.instanceof(File))
    .refine(
      (files) => {
        if (!files || files.length === 0) return true
        const totalBytes = files.reduce((sum, file) => sum + file.size, 0)
        return totalBytes <= 10 * 1024 * 1024 // 10MB
      },
      { message: "Max. 10MB" }
    )
    .optional(),
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
