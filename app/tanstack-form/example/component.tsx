"use client"

import { useActionState } from "react"
import { initialFormState } from "@tanstack/react-form/nextjs"
import { revalidateLogic, mergeForm, useTransform } from "@tanstack/react-form"
import { useAppForm } from "@/components/tanstack-form"
import { serverAction } from "./actions"
import { data, schema } from "./form"

function Component() {
  const [state, action] = useActionState(serverAction, initialFormState)

  const form = useAppForm({
    ...data,
    transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),

    canSubmitWhenInvalid: false,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: schema,
      onSubmit: schema,
    },
  })

  return (
    <div className="mx-auto mt-2 max-w-5xl px-8">
      <form
        noValidate
        className="space-y-4"
        action={action}
        onSubmit={() => {
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

        <div className="pt-8">
          <form.AppForm>
            <form.Button children="Send" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}

export { Component }
