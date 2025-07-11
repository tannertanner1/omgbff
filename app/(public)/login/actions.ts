"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { Action, type ActionResponse } from "@/types/forms"
import { auth, signIn } from "@/lib/auth"

const schema = z.object({
  email: z.string().email("Invalid email"),
})

const { FormData } = Action(schema)

export async function login(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth()
  if (session) redirect("/")

  try {
    const rawData = {
      email: formData.get("email") as string,
    }

    const validatedData = schema.safeParse(rawData)

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      }
    }

    const result = await signIn("resend", {
      email: validatedData.data.email,
      redirect: false,
      redirectTo: "/",
    })

    if (result?.error) {
      console.error("Sign in error:", result.error)
      return {
        success: false,
        message: "Failed to send authentication email",
      }
    }

    return {
      success: true,
      message: "Check your inbox to continue",
    }
  } catch (error) {
    console.error("Authentication error: ", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
