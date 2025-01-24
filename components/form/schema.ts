import { z } from 'zod'

export const formSchema = z.object({
  // Add your form schema here
  // Example:
  // name: z.string().min(1, "Name is required"),
  // email: z.string().email("Invalid email address"),
})

export type FormData = z.infer<typeof formSchema>
