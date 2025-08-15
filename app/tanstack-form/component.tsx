"use client"

import { useActionState } from "react"
import { initialFormState } from "@tanstack/react-form/nextjs"
import { revalidateLogic, mergeForm, useTransform } from "@tanstack/react-form"
import { useAppForm } from "@/components/tanstack-form"
import { someAction } from "./actions"
import { data, schema } from "./form"

function Component() {
  const [state, action] = useActionState(someAction, initialFormState)

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
          children={(field) => (
            <>
              <field.Input label="Name" />
            </>
          )}
        />
        <form.AppForm>
          <form.Button label="Submit" />
        </form.AppForm>

        <pre className="pb-2 font-mono text-xs">
          {JSON.stringify(form.state, null, 2)}
        </pre>
      </form>
    </div>
  )
}

export { Component }
