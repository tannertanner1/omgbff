"use client"

import { useActionState, useEffect, startTransition } from "react"
import { initialFormState } from "@tanstack/react-form/nextjs"
import {
  revalidateLogic,
  mergeForm,
  useTransform,
  useStore,
} from "@tanstack/react-form"
import { useAppForm } from "@/components/tanstack-form"
import { serverAction } from "./actions"
import { data, schema } from "./form"
import { cn } from "@/lib/utils"

function Component() {
  const [state, action] = useActionState(serverAction, initialFormState)

  const form = useAppForm({
    ...data,
    // transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
    transform: useTransform(
      (baseForm) => {
        if (!state) return baseForm
        // Only merge errors, not values, to preserve files
        return mergeForm(baseForm, {
          ...state,
          values: baseForm.state.values, // Preserve current form values including files
        })
      },
      [state]
    ),

    canSubmitWhenInvalid: false,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: schema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      Object.entries(value).forEach(([key, val]) => {
        if (key === "files" && Array.isArray(val)) {
          val.forEach((file: File) => formData.append("files", file))
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val))
        }
      })
      startTransition(() => {
        action(formData)
      })
    },
  })

  const formErrors = useStore(form.store, (formState) => formState.errors)
  const formErrorMap = useStore(form.store, (formState) => formState.errorMap)
  const isSubmitSuccessful = useStore(
    form.store,
    (formState) => formState.isSubmitSuccessful
  )

  // Reset form on success with delay
  useEffect(() => {
    if (isSubmitSuccessful) {
      const timer = setTimeout(() => {
        form.reset()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitSuccessful, form])

  return (
    <div className="mx-auto mt-2 max-w-lg px-8">
      <form
        noValidate
        className="space-y-4"
        action={action}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.AppField
          name="name"
          children={(field) => <field.Input label="Name" />}
        />
        <form.AppField
          name="email"
          children={(field) => <field.Input label="Email" required />}
        />
        <form.AppField
          name="message"
          children={(field) => <field.Textarea label="Message" required />}
        />
        <form.AppField
          name="files"
          children={(field) => <field.Files label="Files" />}
        />

        <div className="relative pt-8">
          <form.AppForm>
            <form.Button children="Send" />
          </form.AppForm>

          {(isSubmitSuccessful || formErrorMap.onSubmit) && (
            <div className="absolute top-full right-0 left-0 mt-6 flex justify-center">
              <span
                className={cn(
                  "text-sm",
                  isSubmitSuccessful ? "text-[#0F9D58]" : "text-destructive"
                )}
              >
                {isSubmitSuccessful
                  ? "Message sent successfully!"
                  : formErrorMap.onSubmit || "Please try again."}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export { Component }
