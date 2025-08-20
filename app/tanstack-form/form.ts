import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Required"),
  address: z.array(
    z.object({
      label: z.string(),
      line1: z.string().min(1, "Required"),
      line2: z.string().optional(),
      city: z.string().min(1, "Required"),
      region: z.string(),
      postal: z.string().min(1, "Required"),
      country: z.string(),
    })
  ),
  phone: z.array(
    z.object({
      label: z.string(),
      number: z.string().min(1, "Required"),
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
        line1: "",
        line2: "",
        city: "",
        region: "",
        postal: "",
        country: "",
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

export { data, schema, type Schema }
