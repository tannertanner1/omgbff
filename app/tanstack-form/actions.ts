"use server"

import {
  createServerValidate,
  ServerValidateError,
} from "@tanstack/react-form/nextjs"
import { data } from "./form"

const serverValidate = createServerValidate({
  ...data,
  onServerValidate: ({ value }) => {
    // console.log("validatedData:", value)
  },
})

async function someAction(prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData)
    // prettier-ignore
    console.log("FormData:", JSON.stringify(Object.fromEntries(Object.entries(validatedData).filter(([key]) => !key.startsWith("$ACTION_"))), null, 2))
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }
    return {
      errors: [{ message: "Something went wrong. Please try again." }],
    }
  }
}

export { someAction }
