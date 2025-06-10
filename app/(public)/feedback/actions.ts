"use server"

import { Resend } from "resend"
import { z } from "zod"
import { Action, type ActionResponse } from "@/types/forms"
import { DOMAIN } from "@/data/public-routes"

const schema = z.object({
  name: z
    .string()
    .max(32, { message: "Name must be at most 32 characters" })
    .optional(),
  message: z
    .string()
    .min(1, { message: "Message required" })
    .max(1000, { message: "Message must be at most 1000 characters" }),
})

const { FormData } = Action(schema)

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function feedback(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name") as string,
    message: formData.get("message") as string,
  }

  try {
    const validatedData = schema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      }
    }

    const { name, message } = validatedData.data

    const subject = name ? `Feedback from ${name}` : `Feedback from ${DOMAIN}`

    // Send email
    await resend.emails.send({
      from: process.env.AUTH_RESEND_EMAIL as string,
      to: [process.env.AUTH_RESEND_EMAIL as string],
      subject: subject,
      html: `<p>${message}</p>`,
    })

    return {
      success: true,
      message: "Feedback sent successfully!",
      inputs: {
        name: "",
        message: "",
      },
    }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      inputs: rawData,
    }
  }
}
