import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"
import {
  ADDRESS,
  PROVINCE,
  STATE,
  PREFECTURE,
  COUNTRY,
  PHONE,
} from "@/data/customer-fields"
import type { Address, Region, Country, Phone } from "@/data/customer-fields"

const schema = z.object({
  name: z.string().min(1, "Required"),
  address: z.array(
    z.object({
      label: z.enum(ADDRESS),
      line1: z.string().min(1, "Required"),
      line2: z.string().optional(),
      city: z.string().min(1, "Required"),
      region: z.union([z.enum(PROVINCE), z.enum(STATE), z.enum(PREFECTURE)]),
      postal: z.string().min(1, "Required"),
      country: z.enum(COUNTRY),
    })
  ),
  phone: z.array(
    z.object({
      label: z.enum(PHONE),
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
        label: ADDRESS[0] as Address,
        line1: "",
        line2: "",
        city: "",
        region: "" as Region,
        postal: "",
        country: COUNTRY[0] as Country,
      },
    ],
    phone: [
      {
        label: PHONE[0] as Phone,
        number: "",
      },
    ],
  } as Schema,
})

export { schema, data }
