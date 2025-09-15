import { formOptions } from "@tanstack/react-form/nextjs"
import { z } from "zod"
import { ADDRESS, COUNTRY, PHONE, CONFIG } from "@/data/customer-fields"
import type { Address, Region, Country, Phone } from "@/data/customer-fields"

const schema = z.object({
  name: z.string().min(1, "Required").min(2, "Invalid"),
  address: z.array(
    z
      .object({
        label: z.preprocess(
          (val) => (val === "" || val == null ? ADDRESS[0] : val),
          z.enum(ADDRESS)
        ),
        line1: z.string().min(1, "Required"),
        line2: z.string().optional(),
        city: z.string().min(1, "Required"),
        region: z.string(),
        postal: z.string().min(1, "Required"),
        country: z.enum(COUNTRY),
      })
      .superRefine((val, ctx) => {
        const re = CONFIG[val.country].postalRegex
        if (val.postal && re && !re.test(val.postal)) {
          ctx.addIssue({ code: "custom", message: "Invalid", path: ["postal"] })
        }
      })
  ),
  phone: z.array(
    z.object({
      label: z.preprocess(
        (val) => (val === "" || val == null ? PHONE[0] : val),
        z.enum(PHONE)
      ),
      number: z
        .string()
        .min(1, "Required")
        .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid"),
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
        region: CONFIG[COUNTRY[0]].defaultRegion as Region,
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
