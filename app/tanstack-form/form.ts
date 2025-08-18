import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  address: z.array(
    z.object({
      label: z.string(),
      street: z.string(),
    })
  ),
  phone: z.array(
    z.object({
      label: z.string(),
      number: z.string(),
    })
  ),
})
type Schema = z.infer<typeof schema>

const data = formOptions({
  defaultValues: {
    name: "",
    address: [
      {
        label: "",
        street: "",
      },
    ],
    phone: [
      {
        label: "",
        number: "",
      },
    ],
  } as Schema,
})

export { schema, data }
