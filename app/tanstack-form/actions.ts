"use server"

import {
  createServerValidate,
  ServerValidateError,
} from "@tanstack/react-form/nextjs"
import { data } from "./form"

const serverValidate = createServerValidate({
  ...data,
  onServerValidate: ({ value }) => {
    console.log("Server validation", value)
  },
})

async function createAction(prev: unknown, formData: FormData) {
  try {
    await serverValidate(formData)
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState
    }
    return {
      errors: [{ message: "Something went wrong. Please try again." }],
    }
  }
}

export { createAction }
