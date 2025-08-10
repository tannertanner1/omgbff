"use server"

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs"
import { data, schema } from "./form"

const serverValidate = createServerValidate({
  ...data,
  canSubmitWhenInvalid: false,
  validators: {
    onSubmit: schema,
  },
  onServerValidate: async ({ value }) => {},
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
